import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  Shield,
  ShieldOff,
  Loader2,
} from "lucide-react";
import DataTable from "../components/common/DataTable";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import { formatDateTime } from "../utils/helpers";
import Select from "../components/ui/Select";
import FilterBar from "../components/ui/FilterBar";
import useGetAllReports from "../hooks/reports/allReports";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useBlockUser, useUnBlockUser } from "../hooks/users/userBlockUser";
import { useReportStatus } from "../hooks/reports/reportStatusChange";
import useGetAllVerifiedBadge from "../hooks/verifiedbadge/useGetAllVerifiedBadge";
import { usebadgeStatusChange } from "../hooks/verifiedbadge/usebadgeStatusChange";

const Verifiedbadge = () => {
  const navigate = useNavigate();
  const defaultFilters = {
    startDate: "",
    endDate: "",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiFilters, setApiFilters] = useState(defaultFilters);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockingUser, setBlockingUser] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    priority: "",
  });
  const [rejectingUser, setRejectingUser] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const { loading: loadingBlock, blockUser } = useBlockUser();
  const { loading: loadingUnBlock, unBlockUser } = useUnBlockUser();
  const { loading: loadingReportStatus, badgeStatus } = usebadgeStatusChange();
  const { totalData, totalPages, verifiedBadge, loading, getVerifiedBadge } =
    useGetAllVerifiedBadge({
      filters: apiFilters,
      search: searchTerm,
      page: currentPage,
      limit: pageSize,
    });
  const filtersProp = useMemo(
    () => [
      {
        key: "search",
        label: "Search",
        type: "text",
        value: filters.search,
        onChange: (value) => setFilters((prev) => ({ ...prev, search: value })),
      },
      {
        key: "startDate",
        label: "Start Date",
        type: "date",
        value: filters.startDate,
        onChange: (value) =>
          setFilters((prev) => ({ ...prev, startDate: value })),
      },
      {
        key: "endDate",
        label: "End Date",
        type: "date",
        value: filters.endDate,
        onChange: (value) =>
          setFilters((prev) => ({ ...prev, endDate: value })),
      },
    ],
    [filters]
  );

  useEffect(() => {
    setCurrentPage(1);
    setApiFilters(filters);
  }, [filters]);
  const openRejectModal = (user) => {
    setRejectingUser(user);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    try {
      const success = await badgeStatus({
        reportId: rejectingUser.id,
        status: "REJECTED",
        rejectionReason: rejectReason, // same key
      });

      if (success) {
        toast.success("User rejected successfully");
        getVerifiedBadge();
        setShowRejectModal(false);
        setRejectingUser(null);
        setRejectReason("");
      }
    } catch (err) {
      toast.error("Failed to reject user");
    }
  };

  const handleToggleBlock = (report) => {
    setBlockingUser(report);
    setBlockReason(""); // reset previous reason
    setShowBlockModal(true);
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const success = await badgeStatus({
        reportId,
        status: newStatus.toUpperCase(),
        rejectionReason: rejectReason,
      });

      if (success) {
        toast.success(`Status updated to ${newStatus}`);
        getVerifiedBadge();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (_, user, index) => index + 1,
    },
    {
      key: "fullName",
      label: "User Name",
      render: (_, user) => user.fullName,
    },
    {
      key: "email",
      label: "Email",
      render: (_, user) => user.email,
    },
    {
      key: "verificationStatus",
      label: "Status",
      render: (_, user) => (
        <Badge
          variant={
            user.verificationStatus === "VERIFIED"
              ? "success"
              : user.verificationStatus === "REJECTED"
              ? "danger"
              : "default"
          }
        >
          {user.verificationStatus}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, user) => (
        <div className="flex items-center space-x-2">
          {/* View details */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(user)}
            icon={<Eye className="w-4 h-4" />}
            title="View Details"
          />

          {/* Verify button */}
          {user.verificationStatus !== "VERIFIED" && (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleStatusChange(user.id, "VERIFIED")}
              icon={<CheckCircle className="w-4 h-4" />}
              title="Verify"
            />
          )}

          {/* Reject button */}
          {user.verificationStatus !== "REJECTED" && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => openRejectModal(user)}
              icon={<XCircle className="w-4 h-4" />}
              title="Reject"
            />
          )}
        </div>
      ),
    },
  ];

  const handleView = (report) => {
    navigate(`/verified-badge-detail/${report?.id}`);
    // setShowDetailModal(true);
  };

  const handleUnBlockUser = async (report) => {
    // Construct payload correctly
    const payload =
      // unblock
      { userId: report.entityId }; // block

    try {
      const response = await unBlockUser(payload);
      console.log(response, "response");
      if (response) {
        toast.success(response.message || "Action successful");
        getAllReport();
        setShowBlockModal(false);
        setBlockReason("");
        setBlockingUser(null);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleBlockUser = async (report) => {
    // Construct payload correctly
    const payload =
      // unblock
      { userId: report.entityId, reason: blockReason }; // block

    try {
      const response = await blockUser(payload);
      console.log(response, "response");
      if (response) {
        toast.success(response.message || "Action successful");
        getAllReport();
        setShowBlockModal(false);
        setBlockReason("");
        setBlockingUser(null);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleConfirmBlock = async () => {
    if (!blockingUser) return;

    if (!blockingUser.isBlockedByAdmin && !blockReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    // Call with the user object, not payload
    if (blockingUser.isBlockedByAdmin) {
      // User is blocked, so we want to unblock
      await handleUnBlockUser(blockingUser);
    } else {
      // User is not blocked, so we want to block
      await handleBlockUser(blockingUser);
    }
  };

 

  // Filter reports

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Verified Badge
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {totalData || "0"}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <FilterBar
          filters={filtersProp}
          onClear={() => setFilters(defaultFilters)}
        />
      </Card>

      {/* Reports Table */}
      <DataTable
        title="Verified Badges"
        data={verifiedBadge}
        loading={loading}
        columns={columns}
        totalData={totalData}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        searchTerm={searchTerm}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSearch={setSearchTerm}
      />

      {/* Report Detail Modal */}

      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title={`Reject ${rejectingUser?.fullName}`}
        size="md"
      >
        {rejectingUser && (
          <div className="space-y-4">
            <p>
              Provide a reason for rejecting{" "}
              <strong>{rejectingUser.fullName}</strong>:
            </p>
            <textarea
              className="border w-full rounded-md p-3"
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason..."
            />
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleRejectConfirm}>
                Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Verifiedbadge;

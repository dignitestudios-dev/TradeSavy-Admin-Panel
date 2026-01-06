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

const Reports = () => {
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
  const { loading: loadingBlock, blockUser } = useBlockUser();
  const { loading: loadingUnBlock, unBlockUser } = useUnBlockUser();
  const { loading: loadingReportStatus, reportStatus } = useReportStatus();
  const { totalData, totalPages, reports, loading, getAllReport } =
    useGetAllReports({
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

  const handleToggleBlock = (report) => {
    setBlockingUser(report);
    setBlockReason(""); // reset previous reason
    setShowBlockModal(true);
  };

  const handleStatusChange = async (reportId, newStatus) => {
    // If newStatus is an object like { target: { value } }, extract it
    if (newStatus?.target?.value) newStatus = newStatus.target.value;

    try {
      const success = await reportStatus({
        reportId,
        status: newStatus.toUpperCase(),
      });
      if (success) {
        toast.success(`Report status updated to ${newStatus}`);
        getAllReport();
      } else {
        throw new Error("API failed");
      }
    } catch (error) {
      console.error("Status change error:", error);
      toast.error("Failed to update status");
    }
  };

  const columns = [
    {
      key: "key",
      label: "ID",
      render: (_, __, index) => index + 1,
    },

    {
      key: "reportedByUser",
      label: "Reported By",
      render: (_, report) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {report?.reportedByUser?.fullName?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium">
              {report?.reportedByUser?.fullName || "-"}
            </p>
            <p className="text-sm text-gray-500">
              {report?.reportedByUser?.email || "-"}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "entityType",
      label: "Entity Type",
      render: (value) => <Badge variant="info">{value}</Badge>,
    },

    {
      key: "entityId",
      label: "Entity ID",
      render: (value) => <span className="text-xs text-gray-500">{value}</span>,
    },

   {
  key: "status",
  label: "Status",
  render: (value, report) => {
    const allOptions = [
      { value: "pending", label: "Pending" },
      { value: "under_review", label: "Under Review" },
      { value: "resolved", label: "Resolved" },
    ];

    // Filter out "pending" if report is not PENDING
    const options = report.status === "PENDING"
      ? allOptions
      : allOptions.filter(o => o.value !== "pending");

    return (
      <Select
        value={report.status.toLowerCase()}
        onChange={(e) => handleStatusChange(report.id, e.target.value)}
        options={options}
        disabled={loadingReportStatus || report.status === "RESOLVED"} // still disable dropdown if RESOLVED
      />
    );
  },
}
,
    {
      key: "createdAt",
      label: "Reported At",
      render: (value) => (
        <div>
          <p className="text-sm">{new Date(value).toLocaleDateString()}</p>
          <p className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString()}
          </p>
        </div>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (_, report) => (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(report)}
            icon={<Eye className="w-4 h-4" />}
          />
          {report?.entityType === "USER" && (
            <Button
              variant={report?.isBlockedByAdmin ? "success" : "danger"}
              size="sm"
              onClick={() => handleToggleBlock(report)}
              icon={
                report?.isBlockedByAdmin ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  <ShieldOff className="w-4 h-4" />
                )
              }
              title={report?.isBlockedByAdmin ? "Unblock User" : "Block User"}
            >
              {report?.isBlockedByAdmin ? "Unblock" : "Block"}
            </Button>
          )}
        </>
      ),
    },
  ];

  const handleView = (report) => {
    navigate(`/report-detail/${report?.id}`);
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

  const handleDownload = (report) => {
    alert(`Downloading evidence for report ${report.id}`);
  };

  const handleResolve = (report) => {
    const resolution = prompt("Enter resolution details:");
    if (resolution) {
      setReports(
        reports.map((r) =>
          r.id === report.id
            ? {
                ...r,
                status: "resolved",
                resolution,
                reviewedBy: "Admin User",
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
    }
  };

  const handleDismiss = (report) => {
    const reason = prompt("Enter dismissal reason:");
    if (reason) {
      setReports(
        reports.map((r) =>
          r.id === report.id
            ? {
                ...r,
                status: "dismissed",
                resolution: `Dismissed: ${reason}`,
                reviewedBy: "Admin User",
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
    }
  };

  // Calculate stats
  const pendingReports = reports.filter((r) => r.status === "PENDING").length;
  const under_review = reports.filter(
    (r) => r.status === "UNDER_REVIEW"
  ).length;
  const investigatingReports = reports.filter(
    (r) => r.status === "investigating"
  ).length;
  const resolvedReports = reports.filter((r) => r.status === "RESOLVED").length;
  const highPriorityReports = reports.filter(
    (r) => r.priority === "high"
  ).length;

  // Filter reports

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Reports
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingReports}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Under Rreview
              </p>
              <p className="text-2xl font-bold text-blue-600">{under_review}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Resolved
              </p>
              <p className="text-2xl font-bold text-green-600">
                {resolvedReports}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
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
        title="Reports"
        data={reports}
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
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Report Details"
        size="xl"
      >
        {selectedReport && (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedReport.id} - {selectedReport.subject}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Reported on {formatDateTime(selectedReport.createdAt)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    selectedReport.priority === "high"
                      ? "danger"
                      : selectedReport.priority === "medium"
                      ? "warning"
                      : "default"
                  }
                >
                  {selectedReport.priority} priority
                </Badge>

                <Select
                  value={selectedReport.status}
                  onChange={(e) =>
                    handleStatusChange(selectedReport.id, e.target.value)
                  }
                  options={[
                    { value: "pending", label: "Pending" },
                    { value: "investigating", label: "Investigating" },
                    { value: "resolved", label: "Resolved" },
                    { value: "dismissed", label: "Dismissed" },
                  ]}
                />
              </div>
            </div>

            {/* Report Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Reporter Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Name
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedReport.userName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedReport.userEmail}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      User ID
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedReport.userId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Reported User Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Name
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedReport.reportedUserName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedReport.reportedUserEmail}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      User ID
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedReport.reportedUserId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Report Details
              </h4>
              <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Type
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedReport.type.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Category
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedReport.category.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {selectedReport.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Evidence */}
            {selectedReport.evidence && selectedReport.evidence.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Evidence
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedReport.evidence.map((file, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
                    >
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {file}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => alert(`Downloading ${file}`)}
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resolution */}
            {selectedReport.resolution && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Resolution
                </h4>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-gray-900 dark:text-white">
                    {selectedReport.resolution}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Resolved by {selectedReport.reviewedBy} on{" "}
                    {formatDateTime(selectedReport.updatedAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => handleDownload(selectedReport)}
                icon={<Download className="w-4 h-4" />}
              >
                Download Evidence
              </Button>
              {selectedReport.status === "pending" && (
                <>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleDismiss(selectedReport);
                      setShowDetailModal(false);
                    }}
                    icon={<XCircle className="w-4 h-4" />}
                  >
                    Dismiss
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => {
                      handleResolve(selectedReport);
                      setShowDetailModal(false);
                    }}
                    icon={<CheckCircle className="w-4 h-4" />}
                  >
                    Resolve
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title={blockingUser?.isBlockedByAdmin ? "Unblock User" : "Block User"}
        size="md"
      >
        {blockingUser && (
          <div className="space-y-4">
            {!blockingUser.isBlockedByAdmin ? (
              <>
                <p>
                  Provide a reason for blocking{" "}
                  <strong>{blockingUser.fullName}</strong>:
                </p>
                <textarea
                  className="border w-full rounded-md p-3"
                  rows={4}
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Enter reason..."
                />
              </>
            ) : (
              <p>
                Are you sure you want to <strong>unblock</strong>{" "}
                <strong>{blockingUser.fullName}</strong>?
              </p>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowBlockModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant={blockingUser.isBlockedByAdmin ? "success" : "danger"}
                onClick={handleConfirmBlock}
                disabled={loadingBlock || loadingUnBlock}
              >
                {loadingBlock || loadingUnBlock ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2 inline" />
                ) : null}
                {blockingUser.isBlockedByAdmin ? "Unblock User" : "Block User"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reports;

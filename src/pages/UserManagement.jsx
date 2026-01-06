import { useState, useEffect, useMemo } from "react";
import {
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Shield,
  ShieldOff,
  MessageSquare,
  Calendar,
  Filter,
  User,
  ShieldX,
  ShieldCheck,
  Ban,
  Loader2,
} from "lucide-react";
import DataTable from "../components/common/DataTable";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import FilterBar from "../components/ui/FilterBar";
import Card from "../components/ui/Card";
import { useForm } from "react-hook-form";
import { formatDate, formatDateTime, formatNumber } from "../utils/helpers";
import useGetAllUsers from "../hooks/users/useGetAllUsers";
import StatsCard from "../components/common/StatsCard";
import { api } from "../lib/services";
import toast from "react-hot-toast";
import { useBlockUser, useUnBlockUser } from "../hooks/users/userBlockUser";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockingUser, setBlockingUser] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  console.log(blockingUser, "blockingUser");
  const defaultFilters = {
    startDate: "",
    endDate: "",
  };
  const [filters, setFilters] = useState(defaultFilters);
  const [apiFilters, setApiFilters] = useState(defaultFilters);
  const { loading: loadingBlock, blockUser } = useBlockUser();
  const { loading: loadingUnBlock, unBlockUser } = useUnBlockUser();

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { totalData, totalPages, users, loading, getAllUsers } = useGetAllUsers(
    {
      filters: apiFilters,
      search: searchTerm,
      page: currentPage,
      limit: pageSize,
    }
  );

  useEffect(() => {
    setCurrentPage(1);
    setApiFilters(filters);
  }, [filters]);

  const blockedUsers = users?.filter((u) => u?.isBlockedByAdmin)?.length;
  const usersStats = useMemo(
    () => [
      {
        title: "Total Users",
        value: users?.length,
        icon: User,
        color: "text-primary-600",
        bgColor: "bg-primary-600/20",
      },
      // {
      //   title: "Active Users",
      //   value: formatNumber(10111),
      //   icon: ShieldCheck,
      //   color: "text-green-600",
      //   bgColor: "bg-green-600/20",
      // },
      // {
      //   title: "Inactive Users",
      //   value: formatNumber(10290 - 10111 - 9),
      //   icon: ShieldX,
      //   color: "text-orange-600",
      //   bgColor: "bg-orange-600/20",
      // },

      {
        title: "Blocked Users",
        value: blockedUsers,
        icon: Ban,
        color: "text-red-600",
        bgColor: "bg-red-600/20",
      },
    ],
    []
  );

  const columns = [
    {
      key: "key",
      label: "ID",
      render: (_, __, index) => index + 1,
    },
    {
      key: "fullName",
      label: "Name",
      render: (value, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100/30 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium text-sm">
              {value?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },

    {
      key: "createdAt",
      label: "Joined",

      render: (value) => formatDate(value),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, user) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(user)}
            icon={<Eye className="w-4 h-4" />}
            title="View Details"
          />
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(user)}
            icon={<Edit className="w-4 h-4" />}
            title="Edit User"
          /> */}
          <Button
            variant={user.isBlockedByAdmin ? "success" : "danger"}
            size="sm"
            onClick={() => handleToggleBlock(user)}
            icon={
              user.isBlockedByAdmin ? (
                <Shield className="w-4 h-4" />
              ) : (
                <ShieldOff className="w-4 h-4" />
              )
            }
            title={user.isBlockedByAdmin ? "Unblock User" : "Block User"}
          >
            {user.isBlockedByAdmin ? "Unblock" : "Block"}
          </Button>

          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => handleChat(user)}
            icon={<MessageSquare className="w-4 h-4" />}
            title="Start Chat"
          /> */}
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(user)}
            icon={<Trash2 className="w-4 h-4" />}
            title="Delete User"
          /> */}
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingUser(null);
    reset();
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    reset(user);
    setShowModal(true);
  };

  const handleView = (user) => {
    console.log(user, "user");
    navigate(`/user-detail/${user?.id}`);
    // setSelectedUser(user);
    // setShowDetailModal(true);
  };

  const handleToggleBlock = (user) => {
    setBlockingUser(user);
    setBlockReason(""); // reset previous reason
    setShowBlockModal(true);
  };

  const handleChat = (user) => {
    alert(`Starting chat with ${user.name}`);
  };

  const handleDelete = (user) => {
    if (
      confirm(
        `Are you sure you want to delete ${user.name}? This action cannot be undone.`
      )
    ) {
      setUsers(users.filter((u) => u.id !== user.id));
    }
  };

  const handleUnBlockUser = async (user) => {
    // Construct payload correctly
    const payload =
      // unblock
      { userId: user.id }; // block

    try {
      const response = await unBlockUser(payload);
      console.log(response, "response");
      if (response) {
        toast.success(response.message || "Action successful");
        getAllUsers();
        setShowBlockModal(false);
        setBlockReason("");
        setBlockingUser(null);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const handleBlockUser = async (user) => {
    // Construct payload correctly
    const payload =
      // unblock
      { userId: user.id, reason: blockReason }; // block

    try {
      const response = await blockUser(payload);
      console.log(response, "response");
      if (response) {
        toast.success(response.message || "Action successful");
        getAllUsers();
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

  const onSubmit = (data) => {
    if (editingUser) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u))
      );
    } else {
      const newUser = {
        ...data,
        id: Math.max(...users.map((u) => u.id)) + 1,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        totalTransactions: 0,
        totalSpent: 0,
        isBlocked: false,
      };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {usersStats?.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon ? <stat.icon /> : null}
            colored
            color={stat.color}
            bgColor={stat.bgColor}
            index={index}
          />
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <FilterBar
          filters={filtersProp}
          onClear={() => setFilters(defaultFilters)}
        />
      </Card>

      {/* Data Table */}
      <DataTable
        title="User Management"
        data={users}
        loading={loading}
        onAdd={handleAdd}
        columns={columns}
        totalData={totalData}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        searchTerm={searchTerm}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSearch={setSearchTerm}
        exportable={false}
      />

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? "Edit User" : "Add New User"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
          />

          <Input
            label="Email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message}
          />

          <Input
            label="Phone"
            {...register("phone")}
            error={errors.phone?.message}
          />

          <Input
            label="Address"
            {...register("address")}
            error={errors.address?.message}
          />

          <Select
            label="Role"
            options={[
              { value: "", label: "Select Role" },
              { value: "user", label: "User" },
              { value: "manager", label: "Manager" },
              { value: "admin", label: "Admin" },
            ]}
            {...register("role", { required: "Role is required" })}
            error={errors.role?.message}
          />

          <Select
            label="Status"
            options={[
              { value: "", label: "Select Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            {...register("status", { required: "Status is required" })}
            error={errors.status?.message}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingUser ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* User Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xl">
                  {selectedUser?.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedUser?.fullName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedUser?.email}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge
                    variant={
                      selectedUser?.isBlocked
                        ? "danger"
                        : selectedUser?.status === "active"
                        ? "success"
                        : "default"
                    }
                  >
                    {selectedUser?.isBlocked ? "Blocked" : selectedUser?.status}
                  </Badge>
                  <Badge
                    variant={
                      selectedUser?.role === "admin"
                        ? "danger"
                        : selectedUser?.role === "manager"
                        ? "warning"
                        : "default"
                    }
                  >
                    {selectedUser?.role}
                  </Badge>
                </div>
              </div>
            </div>

            {/* User Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedUser.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Address
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedUser.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Account Statistics
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Total Transactions
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedUser.totalTransactions}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Total Spent
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {/* ${selectedUser.totalSpent.toFixed(2)} */}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Member Since
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Last Login
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedUser.lastLogin
                        ? formatDateTime(selectedUser.lastLogin)
                        : "Never"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              {/* <Button
                variant="outline"
                onClick={() => handleChat(selectedUser)}
                icon={<MessageSquare className="w-4 h-4" />}
              >
                Start Chat
              </Button> */}
              <Button
                variant={selectedUser.isBlocked ? "success" : "danger"}
                onClick={() => {
                  handleToggleBlock(selectedUser);
                  setShowDetailModal(false);
                }}
                icon={
                  selectedUser.isBlocked ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <ShieldOff className="w-4 h-4" />
                  )
                }
              >
                {selectedUser.isBlocked ? "Unblock User" : "Block User"}
              </Button>
              <Button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedUser);
                }}
                icon={<Edit className="w-4 h-4" />}
              >
                Edit User
              </Button>
            </div>
          </div>
        )}
      </Modal>
      {/* Block Modal */}

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

export default UserManagement;

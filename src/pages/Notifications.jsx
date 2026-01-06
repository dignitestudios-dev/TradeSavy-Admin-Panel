import { useEffect, useState } from "react";
import {
  Send,
  Users,
  UserCheck,
  Bell,
  Calendar,
  Eye,
  Trash2,
  Plus,
} from "lucide-react";
import DataTable from "../components/common/DataTable";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import TextArea from "../components/ui/TextArea";
import Select from "../components/ui/Select";
import { useForm } from "react-hook-form";
import { formatDateTime } from "../utils/helpers";
import useCreateNotification from "../hooks/notification/createNotification";
import toast from "react-hot-toast";
import usegetAllNotification from "../hooks/notification/usegetAllNotification";

const Notifications = () => {
  const { loading, createNotification } = useCreateNotification();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const defaultFilters = {
    startDate: "",
    endDate: "",
  };
  const [filters, setFilters] = useState(defaultFilters);
  const [apiFilters, setApiFilters] = useState(defaultFilters);
  const {
    totalData,
    totalPages,
    noti,
    loading: notiLoader,
    getNoti,
  } = usegetAllNotification({
    filters: apiFilters,
    search: searchTerm,
    page: currentPage,
    limit: pageSize,
  });

  const watchType = watch("type");

  const columns = [
    {
      key: "key",
      label: "ID",
      render: (_, __, index) => index + 1,
    },
    {
      key: "title",
      label: "Title",

      render: (value, notification) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value}</p>
        </div>
      ),
    },
    {
      key: "Message",
      label: "Message",

      render: (value, notification) => (
        <div>
          <p className="text-sm text-gray-500 truncate max-w-xs">
            {notification?.message}
          </p>
        </div>
      ),
    },

    {
      key: "createdAt",
      label: "Created",

      render: (value, notification) => (
        <div>
          <p className="text-sm">{new Date(value).toLocaleDateString()}</p>
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    reset();
    setShowCreateModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        message: data.message,
        // only include scheduleFor if user selected a date
        ...(data.scheduledAt ? { scheduleFor: data.scheduledAt } : {}),
      };

      const response = await createNotification(payload); // Hit API
      if (response) {
        toast.success("Notification created successfully!");
        setShowCreateModal(false);
        getNoti(); // refresh notification list from API
      } else {
        toast.error(response?.message || "Failed to create notification");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };
  useEffect(() => {
    setCurrentPage(1);
    setApiFilters(filters);
  }, [filters]);
  return (
    <div className="space-y-6">
      {/* Stats Cards */}

      {/* Notifications Table */}
      <DataTable
        title="Push Notifications"
        data={noti}
        loading={loading}
        onAdd={handleCreate}
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
        addButton={true}
      />

      {/* Create Notification Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Push Notification"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Notification Title"
            {...register("title", { required: "Title is required" })}
            error={errors.title?.message}
            placeholder="Enter notification title"
          />

          <TextArea
            label="Message"
            {...register("message", { required: "Message is required" })}
            rows={4}
            placeholder="Enter notification message"
            error={errors.message?.message}
          />

          {watchType === "role_based" && (
            <Select
              label="Select Role"
              options={[
                { value: "premium_users", label: "Premium Users" },
                { value: "basic_users", label: "Basic Users" },
                { value: "trial_users", label: "Trial Users" },
                { value: "inactive_users", label: "Inactive Users" },
              ]}
              {...register("roleTarget")}
              placeholder="Select Role"
            />
          )}

          {watchType === "specific_users" && (
            <Input
              label="Specific Target Description"
              {...register("specificTarget")}
              placeholder="e.g., Beta Testers, VIP Users, etc."
            />
          )}

          <Input
            label="Schedule (Optional)"
            type="datetime-local"
            {...register("scheduledAt")}
            className="w-full"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {loading ? "Create Notification....." : "Create Notification"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Notification Detail Modal */}
    </div>
  );
};

export default Notifications;

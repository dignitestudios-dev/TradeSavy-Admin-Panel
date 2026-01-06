import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Package,
  User,
  Calendar,
  Clock,
  DollarSign,
  Truck,
} from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { formatDate, formatDateTime } from "../utils/helpers";
import useOrderDetail from "../hooks/orders/useGetDetail";

const OrderDetail = () => {
  const { id } = useParams();
  const { loading, orderDetail:order, refetch } = useOrderDetail(id);

  useEffect(() => {
    refetch();
  }, [id]);

  if (loading || !order) {
    return (
      <div className="flex justify-center py-20 text-gray-400">
        Loading order details...
      </div>
    );
  }

  const product = order.products?.[0];

  return (
    <div className="space-y-6 ">
      {/* ================= Order Summary ================= */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            <p className="text-sm text-gray-500">
              Tracking ID: {order.trackingId}
            </p>
          </div>

          <Badge
            variant={
              order.status === "COMPLETED"
                ? "success"
                : order.status === "PENDING"
                ? "warning"
                : "default"
            }
          >
            {order.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <InfoItem
            icon={DollarSign}
            label="Total Amount"
            value={`$${order.totalAmount}`}
          />
          <InfoItem
            icon={Calendar}
            label="Order Date"
            value={formatDate(order.createdAt)}
          />
          <InfoItem
            icon={Truck}
            label="Order ID"
            value={order.orderId.slice(0, 10) + "..."}
          />
        </div>
      </Card>

      {/* ================= Renter & Lender ================= */}
      <div className="grid md:grid-cols-2 gap-6">
        <UserCard title="Renter" user={order.renter} />
        <UserCard title="Lender" user={order.lender} />
      </div>

      {/* ================= Product Details ================= */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-600" />
          Product Details
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <img
            src={product?.images?.[0]}
            alt={product?.name}
            className="w-full h-60 object-cover rounded-lg"
          />

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">{product?.name}</h3>
            <p className="text-gray-600">{product?.description}</p>

            <div className="flex flex-wrap gap-3 mt-3">
              <Badge variant="outline">Rent Type: {product?.rentType}</Badge>
              <Badge variant="outline">Quantity: {product?.quantity}</Badge>
              <Badge variant="success">${product?.price}</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* ================= Rental Timing ================= */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-600" />
          Rental Timing
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">From</p>
            <p className="font-medium">{formatDateTime(product?.fromHour)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">To</p>
            <p className="font-medium">{formatDateTime(product?.toHour)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ================= Reusable Components ================= */

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
    <Icon className="w-5 h-5 text-primary-600" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const UserCard = ({ title, user }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>

    <div className="flex items-center gap-4">
      <img
        src={user?.profilePicture}
        alt={user?.fullName}
        className="w-14 h-14 rounded-full object-cover"
      />
      <div>
        <p className="font-medium text-gray-900">{user?.fullName || "N/A"}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
        <p className="text-sm text-gray-500">{user?.phoneNumber}</p>
      </div>
    </div>
  </Card>
);

export default OrderDetail;

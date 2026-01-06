import { useParams } from "react-router-dom";
import useUserDetail from "../hooks/users/useUserDetail";
import Card from "../components/ui/Card";
import StatsCard from "../components/common/StatsCard";
import { formatDate } from "../utils/helpers";
import { RefreshCcw } from "lucide-react";
import Badge from "../components/ui/Badge";

const EmptyState = ({ text }) => (
  <p className="text-sm text-gray-400 italic">{text}</p>
);

const UserDetail = () => {
  const { id } = useParams();
  const { user, loading } = useUserDetail(id);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-12 gap-2">
        <RefreshCcw className="animate-spin text-primary-600" />
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* USER INFO */}
      <Card className="p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-600">
            {user?.fullName?.charAt(0) || "?"}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {user?.fullName || "No name"}
            </h2>
            <p className="text-gray-500">{user?.email || "No email"}</p>
            <p className="text-sm text-gray-400">
              {user?.phoneNumber || "No phone number"}
            </p>
            <p className="text-sm mt-1">
              Member since:{" "}
              {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
            </p>
          </div>
        </div>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Items Listed" value={user.itemsListed || 0} />
        <StatsCard title="Items Rented" value={user.itemsRented || 0} />
        <StatsCard title="Order Requests" value={user.orderRequests || 0} />
        <StatsCard
          title="Total Revenue"
          value={`$${user.totalRevenue || 0}`}
        />
      </div>

      {/* RATINGS */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ratings</h3>

        {user?.ratings?.reviews?.length ? (
          user.ratings.reviews.map((review, index) => (
            <div key={index} className="border rounded-md p-4 mb-3">
              <div className="flex justify-between">
                <span>⭐ {review.rating}</span>
                <span className="text-sm text-gray-400">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                {review.review || "No review text"}
              </p>
            </div>
          ))
        ) : (
          <EmptyState text="No ratings found" />
        )}
      </Card>

      {/* LISTED ITEMS */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Listed Items</h3>

        {user?.listedItems?.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {user.listedItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <h4 className="font-semibold">{item.name || "Unnamed item"}</h4>
                <p className="text-sm text-gray-500">
                  Day: ${item.pricePerDay || 0} | Hour: $
                  {item.pricePerHour || 0}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="No listed items found" />
        )}
      </Card>

      {/* RENTED ITEMS */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Rented Items</h3>

        {user?.rentedItems?.length ? (
          user.rentedItems.map((order) => (
            <div
              key={order.id}
              className="border rounded-md p-4 flex justify-between mb-2"
            >
              <div>
                <p className="font-medium">{order.trackingId}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${order.totalAmount}</p>
                <Badge variant="success">{order.status}</Badge>
              </div>
            </div>
          ))
        ) : (
          <EmptyState text="No rented items found" />
        )}
      </Card>

      {/* RECEIVED ORDERS */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Received Orders</h3>

        {user?.receivedOrders?.length ? (
          user.receivedOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 flex gap-4 mb-3"
            >
              <div className="flex gap-2">
                {order.products?.length ? (
                  order.products.map((p, i) => (
                    <img
                      key={i}
                      src={p.product?.images?.[0]}
                      alt="product"
                      className="w-20 h-20 rounded-md object-cover border"
                    />
                  ))
                ) : (
                  <EmptyState text="No product image" />
                )}
              </div>

              <div className="flex-1 flex justify-between">
                <div>
                  <p className="font-semibold">
                    Tracking ID: {order.trackingId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="mt-1">
                    Total: ${order.totalAmount || 0}
                  </p>
                </div>

               <div>
                 <Badge
                  variant={
                    order.status === "COMPLETED"
                      ? "success"
                      : order.status === "PENDING"
                      ? "warning"
                      : "danger"
                  }
                >
                  {order.status}
                </Badge>
               </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState text="No received orders found" />
        )}
      </Card>
    </div>
  );
};

export default UserDetail;

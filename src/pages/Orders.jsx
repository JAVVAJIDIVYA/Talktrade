import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiMessageSquare, FiCheck, FiClock, FiCreditCard, FiDollarSign } from "react-icons/fi";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { orderAPI, conversationAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { formatINR } from "../utils/currency";

const Orders = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await orderAPI.getOrders();
      return res.data;
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (id) => orderAPI.confirmOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });

  const handleContact = async (order) => {
    try {
      const userId = currentUser.isSeller ? order.buyerId._id : order.sellerId._id;
      await conversationAPI.createConversation({ to: userId });
      navigate("/messages");
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">
            {currentUser?.isSeller
              ? "Manage orders from your buyers"
              : "Track your purchased services"}
          </p>
        </div>

        {/* Orders Table */}
        {orders && orders.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      {currentUser?.isSeller ? "Buyer" : "Seller"}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => {
                    const otherUser = currentUser?.isSeller
                      ? order.buyerId
                      : order.sellerId;
                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <img
                            src={order.img || "https://placehold.co/80x60?text=Order"}
                            alt={order.title}
                            className="w-20 h-14 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = "https://placehold.co/80x60?text=Order";
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/gig/${order.gigId}`}
                            className="font-medium text-gray-900 hover:text-primary line-clamp-2"
                          >
                            {order.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-semibold text-gray-900 block">
                              {formatINR(order.priceInr || order.price)}
                            </span>
                            {order.paymentMethod && (
                              <span className="text-xs text-gray-500 flex items-center mt-1">
                                <FiCreditCard className="w-3 h-3 mr-1" />
                                {order.paymentMethod}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={
                                otherUser?.img ||
                                `https://ui-avatars.com/api/?name=${otherUser?.username}&background=1dbf73&color=fff`
                              }
                              alt={otherUser?.username}
                              className="w-8 h-8 rounded-full object-cover mr-2"
                            />
                            <span className="text-gray-700">
                              {otherUser?.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {order.isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              <FiCheck className="w-4 h-4" />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                              <FiClock className="w-4 h-4" />
                              In Progress
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleContact(order)}
                              className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition"
                              title="Message"
                            >
                              <FiMessageSquare className="w-5 h-5" />
                            </button>
                            {currentUser?.isSeller && !order.isCompleted && (
                              <button
                                onClick={() => confirmMutation.mutate(order._id)}
                                disabled={confirmMutation.isPending}
                                className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                              >
                                {confirmMutation.isPending
                                  ? "..."
                                  : "Mark Complete"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 mb-6">
              {currentUser?.isSeller
                ? "When buyers purchase your gigs, orders will appear here"
                : "Browse services and make your first purchase"}
            </p>
            <Link
              to="/gigs"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              Browse Services
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

import React, { useEffect } from "react";
import { useOrderStore } from "../../../store/user/useOrderStore";
import { Package, ChevronRight, XCircle, Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const navigate = useNavigate();
  const styles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    confirmed: "bg-blue-50 text-blue-600 border-blue-100",
    out_for_delivery: "bg-purple-50 text-purple-600 border-purple-100",
    delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cancelled: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || styles.pending}`}
    >
      {status.replace(/_/g, " ").toUpperCase()}
    </span>
  );
};

export default function MyOrders() {
  const { orders, fetchMyOrders, cancelOrder, loading } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  if (loading)
    return (
      <div className="p-20 text-center text-emerald-600">
        Loading your harvest...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-gray-600 hover:text-green-700"
        >
          <ArrowLeft className="w-5 h-5" /> Continue Shopping
        </button>
        <h1 className="text-4xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Package className="text-emerald-600" /> My Orders
        </h1>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl">
            <p className="text-slate-500">
              No orders found. Time to go shopping!
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border-3 border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-bold text-slate-800">
                      Order #{order._id.slice(-8)}
                    </span>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                  <p className="text-md text-slate-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    <p className="text-md text-slate-400 uppercase font-semibold tracking-wider">
                      Total
                    </p>
                    <p className="font-bold text-emerald-700">
                      ₹{order.actualAmount}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/profile/orders/${order._id}`)}
                    className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-full transition-colors"
                    title="View Details"
                  >
                    <Eye size={24} />
                  </button>
                  {!["out_for_delivery", "delivered", "cancelled"].includes(
                    order.orderStatus,
                  ) && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to cancel this harvest?",
                          )
                        )
                          cancelOrder(order._id);
                      }}
                      className="p-2 hover:bg-rose-50 text-rose-500 rounded-full transition-all active:scale-90"
                      title="Cancel Order"
                    >
                      <XCircle size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

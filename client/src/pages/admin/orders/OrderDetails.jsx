import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Loader2,
  AlertCircle,
  Package,
  Truck,
  CheckCircle,
  Clock,
} from "lucide-react";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
import { useOrderStore } from "../../../store/user/useOrderStore";

export default function OrderDetails() {
  const { id } = useParams();

  const {
    selectedOrder,
    fetchOrderById,
    updateOrderStatus,
    loading,
    error,
    clearOrderDetails,
  } = useOrderStore();

  const [status, setStatus] = useState("");

  // 2. Fetch data on mount
  useEffect(() => {
    fetchOrderById(id);
    return () => clearOrderDetails(); // Cleanup alerts on unmount
  }, [id, fetchOrderById, clearOrderDetails]);
  console.log("selected order details :", selectedOrder);

  // 3. Sync local status state when order data arrives
  useEffect(() => {
    if (selectedOrder) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus(selectedOrder.orderStatus);
    }
  }, [selectedOrder]);

  const handleUpdateStatus = async () => {
    await updateOrderStatus(id, status);
  };

  // --- LOADING STATE ---
  if (loading && !selectedOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-gray-500 mt-4">Retrieving order dossier...</p>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || !selectedOrder) {
    return (
      <div className="p-10 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-gray-500">
          {error || "The requested order does not exist."}
        </p>
      </div>
    );
  }

  // Data helpers from the new API structure
  const { userId, addressSnapshot, items } = selectedOrder;

  return (
    <div className="space-y-6">
      <AdminHeaderWrapper
        title={`Order #${selectedOrder._id}`}
        description="Complete order information and tracking"
        breadcrumb={[
          { label: "Orders", to: "/admin/orders" },
          { label: selectedOrder._id },
        ]}
      />

      {/* {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl flex items-center gap-2 animate-pulse">
          <CheckCircle size={20} /> {successMessage}
        </div>
      )} */}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT SECTION: Items and Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Address Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
                Customer Info
              </h3>
              <p className="font-semibold text-lg">
                {userId?.firstName} {userId?.lastName}
              </p>
              <p className="text-sm text-gray-600">{userId?.email}</p>
              <p className="text-sm text-gray-600">{userId?.phone}</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100">
              <h3 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                Shipping Address
              </h3>
              <p className="font-semibold">{addressSnapshot?.fullName}</p>
              <div className="text-sm text-blue-800">
                <p className="text-sm text-blue-800">
                  {addressSnapshot?.phone}
                </p>
                {addressSnapshot?.addressLine1},{" "}
                {/* {shipping_address?.address_line2} */}
              </div>
              <p className="text-sm text-blue-800">
                {addressSnapshot?.city} - {addressSnapshot?.pincode}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Package size={20} className="text-gray-400" /> Order Items
            </h3>
            <div className="divide-y divide-gray-100">
              {items?.map((item) => (
                <div
                  key={item._id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-bold">
                      {item.quantity_unit}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.productName} - {item?.productId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Variant: {item.variantName} | Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{item.price}</p>
                    {/* <p className="text-xs text-gray-400">
                      ₹{item.price_per_unit} / unit
                    </p> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Actual amount</span>
              <span>₹{selectedOrder.actualAmount}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Discount ({selectedOrder?.discountSource || "None"})</span>
              <span>- ₹{selectedOrder?.discountAmount}</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-bold text-lg">Total Amount</span>
              <span className="font-bold text-2xl text-primary">
                ₹{selectedOrder.subTotal}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: Status Management */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock size={20} className="text-gray-400" /> Order Status
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedOrder.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {selectedOrder.paymentStatus}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Update Progression
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full mt-2 p-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="out_for_delivery">🚚 Out For Delivered</option>
                  <option value="delivered">🏠 Delivered</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Truck size={18} />
                )}
                Update Status
              </button>
            </div>
          </div>

          {/* <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 text-center">
            <p className="text-xs text-gray-500">Stripe Transaction ID</p>
            <code className="text-[10px] text-gray-400 break-all">
              {selectedOrder.stripe_payment_id || "N/A"}
            </code>
          </div> */}
        </div>
      </div>
    </div>
  );
}

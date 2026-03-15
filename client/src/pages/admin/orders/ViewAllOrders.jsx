import { useState, useMemo, useEffect } from "react";
import {
  Eye,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
import Pagination from "../../../components/admin/Pagination";
// import { useAdminOrderStore } from "../../../store/admin/AdminOrderStore";
import { useOrderStore } from "../../../store/user/useOrderStore";

const wrapperData = {
  title: "Order Management",
  description: "Track, manage, and process customer orders across all channels",
  breadcrumb: [
    { label: "Dashboard", to: "/admin" },
    { label: "Orders", to: "/admin/orders" },
  ],
};

export default function ViewAllOrders() {
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { fetchAllOrders, orders, loading, error } = useOrderStore();

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);
  console.log("orders :", orders);

  // Combined Search and Filter Logic
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = status === "all" || o.orderStatus === status;

      const customerName = `${o.userId?.firstName || ""} ${
        o.userId?.lastName || ""
      }`.toLowerCase();
      const customerEmail = (o.userId?.email || "").toLowerCase();
      const orderId = o._id.toString();
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        orderId.includes(query) ||
        customerName.includes(query) ||
        customerEmail.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [status, searchQuery, orders]);

  const start = (currentPage - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.orderStatus === "pending").length,
      confirmed: orders.filter((o) => o.orderStatus === "confirmed").length,
      delivered: orders.filter((o) => o.orderStatus === "delivered").length,
      outForDelivered: orders.filter(
        (o) => o.orderStatus === "out_for_delivery",
      ).length,
    }),
    [orders],
  );

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-125 bg-white rounded-3xl mt-6 border border-gray-100 shadow-sm">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-gray-500 mt-4 font-medium italic">
          Synchronizing orders...
        </p>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <AdminHeaderWrapper {...wrapperData} />

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-8 mt-6">
        <StatCard
          title="Total Orders"
          count={stats.total}
          icon={<ShoppingBag size={20} />}
          color="text-gray-600"
          bg="bg-gray-50"
          border="border-gray-200"
        />
        <StatCard
          title="Pending"
          count={stats.pending}
          icon={<Clock size={20} />}
          color="text-yellow-600"
          bg="bg-yellow-50"
          border="border-yellow-200"
        />
        <StatCard
          title="Confirmed"
          count={stats.confirmed}
          icon={<Filter size={20} />}
          color="text-blue-600"
          bg="bg-blue-50"
          border="border-blue-200"
        />
        <StatCard
          title="Delivered"
          count={stats.delivered}
          icon={<CheckCircle2 size={20} />}
          color="text-green-600"
          bg="bg-green-50"
          border="border-green-200"
        />
        <StatCard
          title="out For Delivered"
          count={stats.outForDelivered}
          icon={<CheckCircle2 size={20} />}
          color="text-blue-600"
          bg="bg-blue-50"
          border="border-blue-200"
        />
      </div>

      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3 border border-red-100 shadow-sm">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Search and Control Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-1 flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-70 lg:max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by Order ID, Name, or Email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">
                Status:
              </span>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-gray-50 border-2 border-gray-200 px-4 py-2.5 rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="hidden lg:block text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
              Results
            </p>
            <p className="text-sm font-black text-gray-700">
              {filtered.length} Orders
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white p-4 rounded-3xl shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 text-sm uppercase tracking-wider border-b">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Placed On</th>
                  <th className="p-4 font-bold">Customer Info</th>
                  <th className="p-4 font-bold">Total Amount</th>
                  <th className="p-4 font-bold">Payment</th>
                  <th className="p-4 font-bold">Order Status</th>
                  <th className="p-4 font-bold text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-300">
                {paginated.length > 0 ? (
                  paginated.map((o) => (
                    <tr
                      key={o._id}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-5 font-bold text-primary text-sm tracking-tight">
                        #{o._id}
                      </td>
                      <td className="p-5">
                        <p className="text-sm font-semibold text-gray-700">
                          {new Date(o.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase">
                          {new Date(o.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-bold text-gray-800">
                          {o.userId
                            ? `${o.userId.firstName} ${o.userId.lastName}`
                            : "Guest User"}
                        </div>
                        <div className="text-xs text-gray-400 font-medium lowercase">
                          {o.userId?.email || "No email provided"}
                        </div>
                      </td>
                      <td className="p-5 font-black text-gray-900 text-sm">
                        ₹{Number(o.subTotal).toLocaleString("en-IN")}
                      </td>
                      <td className="p-5 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${
                            o.payment_status === "paid"
                              ? "bg-green-50 text-green-600 border-green-100"
                              : "bg-gray-50 text-gray-500 border-gray-100"
                          }`}
                        >
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyles(
                            o.orderStatus,
                          )}`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${getStatusDot(
                              o.orderStatus,
                            )}`}
                          />
                          {o.orderStatus}
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/orders/${o._id}`}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg border border-blue-100"
                            title="View Details"
                          >
                            <Eye size={20} />
                          </Link>
                          {/* <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg border border-red-100 cursor-pointer"
                            title="Delete Promotion"
                          >
                            <Trash2 size={20} />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <XCircle size={40} strokeWidth={1} />
                        <p className="mt-2 font-medium">
                          No orders match your current search criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
          <Pagination
            totalItems={filtered.length}
            currentPage={currentPage}
            perPage={perPage}
            onPageChange={setCurrentPage}
            onPerPageChange={setPerPage}
          />
        </div>
      </div>
    </div>
  );
}

// --- Helper Components & Functions ---

function StatCard({ title, count, icon, color, bg, border }) {
  return (
    <div
      className={`bg-white p-5 rounded-3xl shadow-sm border ${border} flex items-center justify-between transition-transform hover:scale-[1.02]`}
    >
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {title}
        </p>
        <p className="text-2xl font-black text-gray-800">{count}</p>
      </div>
      <div className={`p-3 rounded-2xl ${bg} ${color}`}>{icon}</div>
    </div>
  );
}

function getStatusStyles(status) {
  switch (status) {
    case "delivered":
      return "bg-green-50 text-green-600 border-green-100";
    case "pending":
      return "bg-yellow-50 text-yellow-600 border-yellow-100";
    case "confirmed":
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "cancelled":
      return "bg-red-50 text-red-600 border-red-100";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
}

function getStatusDot(status) {
  switch (status) {
    case "delivered":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "confirmed":
      return "bg-blue-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
}

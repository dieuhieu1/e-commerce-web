import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  DollarSign,
  User,
  Phone,
  MapPin,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react";
import ManagePagination from "@/components/Pagination/MangePagination";
import { getStatusColor, orderStats } from "@/ultils/constants";
import {
  formatCurrency,
  formatCurrencyVND,
  formatDate,
} from "@/ultils/helpers";
import { apiGetOrders, apiGetOrdersStats } from "@/apis/order";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const ManageOrder = () => {
  const [params, setParams] = useSearchParams();

  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [orders, setOrders] = useState(null);
  const [stats, setStats] = useState(null);
  const [tabs, setTabs] = useState([
    { id: "all", label: "All Orders", count: 1234, dataKey: "totalOrders" },
    { id: "Pending", label: "Pending", count: 156, dataKey: "totalPending" },
    {
      id: "Processing",
      label: "Processing",
      count: 89,
      dataKey: "totalProcessing",
    },
    { id: "Shipping", label: "Shipping", count: 67, dataKey: "totalShipping" },
    { id: "Succeed", label: "Delivered", count: 89, dataKey: "totalSucceed" },
    {
      id: "Cancelled",
      label: "Cancelled",
      count: 186,
      dataKey: "totalCancelled",
    },
  ]);

  const fetchOrderStats = async () => {
    try {
      const response = await apiGetOrdersStats();
      if (response.success) {
        const statsData = response.orderStats;
        const formatedData = orderStats.map((el) => {
          const value = statsData[el.dataKey];
          return { ...el, value: value };
        });
        const formatedTabs = tabs.map((el) => {
          const value = statsData[el.dataKey];

          return { ...el, count: value };
        });
        setTabs(formatedTabs);
        setStats(formatedData);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const fetchOrders = async (queries) => {
    try {
      const response = await apiGetOrders({ ...queries, limit: 5 });
      if (response.success && response.order) {
        setOrders(response);
      }
    } catch (error) {
      console.error("Failed to fetch recent orders:", error);
    }
  };
  useEffect(() => {
    const queries = Object.fromEntries(params.entries());
    fetchOrderStats();
    fetchOrders(queries);
  }, [params]);

  const handleTabChange = (tab) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("status", tab.id);
      newParams.set("page", 1);
      return newParams;
    });

    setSelectedTab(tab.id);
  };
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      console.log("Deleting order:", orderId);
      // API call here
    }
  };
  const getStatusIcon = (status) => {
    const icons = {
      Pending: Clock,
      Processing: RefreshCw,
      Shipping: Truck,
      Succeed: CheckCircle,
      Cancelled: XCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
  };
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order Management
              </h1>
              <p className="text-gray-600">
                Track and manage all your orders in one place
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats?.map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: "bg-blue-50 text-blue-600",
                yellow: "bg-yellow-50 text-yellow-600",
                green: "bg-green-50 text-green-600",
                red: "bg-red-50 text-red-600",
              };

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg ${colorClasses[stat.color]}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Search and Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    selectedTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      selectedTab === tab.id
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      Order ID
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      Total
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      Date
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders?.order?.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-blue-600">
                        {order._id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.orderedBy.avatar.image_url}
                          alt={order.orderedBy.firsname}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {order.orderedBy.firstname +
                              order.orderedBy.lastname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.orderedBy.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {order.products.slice(0, 3).map((product, idx) => (
                            <img
                              key={idx}
                              src={product.thumb}
                              alt={product.title}
                              className="w-8 h-8 rounded border-2 border-white"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {order.products.length} item(s)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">
                        {formatCurrencyVND(order.total * 25000)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order)}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                          title="Update Status"
                        >
                          <Edit className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <ManagePagination pageSize={5} totalCount={orders?.totalCount} />
        </div>

        {/* Order Detail Modal */}
        {isDetailModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Details
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Status and Date */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selectedOrder.orderDate)}
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold text-gray-900">
                          {selectedOrder.customer.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedOrder.customer.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold text-gray-900">
                          {selectedOrder.customer.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                      <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Shipping Address
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedOrder.shippingAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Products
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.products.map((product, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {product.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {formatCurrency(product.price * product.quantity)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(product.price)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Payment Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        {formatCurrency(selectedOrder.total * 0.9)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        {formatCurrency(selectedOrder.total * 0.05)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Tax</span>
                      <span className="font-semibold">
                        {formatCurrency(selectedOrder.total * 0.05)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-3">
                      <DollarSign className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-600">
                        Payment Method:{" "}
                        <span className="font-semibold text-gray-900">
                          {selectedOrder.paymentMethod}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder)}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Update Status
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                    Print Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {/* {isStatusModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Update Order Status
                </h2>
                <p className="text-gray-600 mb-6">
                  Order ID: {selectedOrder.id}
                </p>

                <div className="space-y-3">
                  {[
                    "pending",
                    "processing",
                    "shipping",
                    "completed",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        console.log("Updating status to:", status);
                        setIsStatusModalOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        selectedOrder.status === status
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {getStatusIcon(status)}
                      <span className="font-semibold">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      {selectedOrder.status === status && (
                        <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => setIsStatusModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ManageOrder;

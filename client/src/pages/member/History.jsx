import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
} from "lucide-react";
import { apiGetMyOrders } from "@/apis/order";
import {
  formatCurrency,
  formatCurrencyVND,
  formatDate,
} from "@/ultils/helpers";

// Import your real API
// import { apiGetMyOrders } from "@/apis/order";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Succeed");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMyOrder = async (params) => {
    try {
      setLoading(true);
      const response = await apiGetMyOrders({
        ...params,
        limit: 15,
      });
      console.log(response.order);

      setOrders(response.order || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      Succeed: {
        label: "Delivered",
        icon: CheckCircle,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-300",
      },
      Cancelled: {
        label: "Cancelled",
        icon: XCircle,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-300",
      },
    };
    return configs[status] || configs["Pending"];
  };
  const total = formatCurrencyVND(
    orders.reduce((sum, o) => sum + Number(o?.total || 0), 0).toFixed(2) * 25000
  );

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.products.some((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) || order._id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Package size={40} />
            <div>
              <h1 className="text-3xl font-bold">Order History</h1>
              <p className="text-orange-100">
                Track and manage all your orders
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-orange-100 text-sm">Total Orders</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-orange-100 text-sm">Completed</p>
              <p className="text-3xl font-bold">
                {orders.filter((o) => o.status === "Succeed").length}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-orange-100 text-sm">Total Spent</p>
              <p className="text-2xl font-bold">{formatCurrency(total)}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by order ID or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="Succeed">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedOrder === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Order Header */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <Package className="text-orange-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Calendar size={14} />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-xl font-bold text-orange-600">
                            {formatCurrency(total)}
                          </p>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-lg border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} flex items-center gap-2`}
                        >
                          <StatusIcon size={18} />
                          <span className="font-semibold">
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product Summary */}
                    <div className="flex items-center justify-between py-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        {order.products.length}{" "}
                        {order.products.length === 1 ? "item" : "items"}
                      </p>
                      <button
                        onClick={() => toggleExpand(order._id)}
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <span>Hide Details</span>
                            <ChevronUp size={18} />
                          </>
                        ) : (
                          <>
                            <span>View Details</span>
                            <ChevronDown size={18} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.products.map((item) => (
                          <div
                            key={item._id}
                            className="bg-white rounded-lg p-4 flex gap-4"
                          >
                            <img
                              src={
                                item.thumb || "https://via.placeholder.com/80"
                              }
                              alt={item.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 mb-1">
                                {item.title}
                              </h5>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Color:</span>
                                  <span className="px-2 py-0.5 bg-gray-100 rounded">
                                    {item.color}
                                  </span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Quantity:</span>
                                  <span>{item.quantity}</span>
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-orange-600">
                                {formatCurrency(item.price)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-gray-600">
                                  {formatCurrency(item.price * item.quantity)}{" "}
                                  total
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Timeline */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Order Timeline
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full">
                              <CheckCircle
                                className="text-green-600"
                                size={16}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Order Placed
                              </p>
                              <p className="text-xs text-gray-600">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${statusConfig.bgColor}`}
                            >
                              <StatusIcon
                                className={statusConfig.textColor}
                                size={16}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {statusConfig.label}
                              </p>
                              <p className="text-xs text-gray-600">
                                {formatDate(order.updatedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;

import React, { useState, useEffect } from "react";
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  RefreshCw,
} from "lucide-react";
import { orderStats } from "@/ultils/constants";
import { apiGetOrders, apiGetOrdersStats } from "@/apis/order";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import OrderTable from "@/components/Order/OrderTable";
import ViewDetailOrderDialog from "@/components/Dialog/ViewDetailOrderDialog";
import UpdateStatusDialog from "@/components/Dialog/UpdateStatusDialog";
import { useDebounce } from "@/hooks/useDebounce";
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
const ManageOrder = () => {
  const [params, setParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const debouncedSearch = useDebounce(searchQuery, 800);

  useEffect(() => {
    const newParams = new URLSearchParams(params);
    if (debouncedSearch) newParams.set("search", debouncedSearch);
    else newParams.delete("search");
    newParams.set("page", 1);

    if (newParams.toString() !== params.toString()) {
      setParams(newParams);
    }
  }, [debouncedSearch, params, setParams]);

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
    setIsLoading(true);
    try {
      const response = await apiGetOrders({ ...queries, limit: 5 });
      if (response.success && response.order) {
        setOrders(response);
      } else {
        setOrders(null);
      }
    } catch (error) {
      console.error("Failed to fetch recent orders:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchOrderStats();
  }, []);

  useEffect(() => {
    const queries = Object.fromEntries(params.entries());
    fetchOrders(queries);
  }, [params]);

  const handleRefreshOrders = () => {
    fetchOrders();
    fetchOrderStats();
  };
  const handleTabChange = (tab) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (tab.id === "all") newParams.delete("status");
      else newParams.set("status", tab.id);
      newParams.delete("orderId");
      newParams.set("page", 1);
      return newParams;
    });

    setSelectedTab(tab.id);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleClickUpdateStatusBtn = (order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
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

        {/* Orders table */}
        <OrderTable
          orders={orders}
          isLoading={isLoading}
          getStatusIcon={getStatusIcon}
          handleViewDetails={handleViewDetails}
          handleClickUpdateStatusBtn={handleClickUpdateStatusBtn}
        />

        {/* Order Detail Modal */}
        {isDetailModalOpen && selectedOrder && (
          <ViewDetailOrderDialog
            isDetailModalOpen={isDetailModalOpen}
            getStatusIcon={getStatusIcon}
            handleClickUpdateStatusBtn={handleClickUpdateStatusBtn}
            selectedOrder={selectedOrder}
            setIsDetailModalOpen={setIsDetailModalOpen}
          />
        )}

        {/* Update Status Modal */}
        {isStatusModalOpen && selectedOrder && (
          <UpdateStatusDialog
            onUpdateSuccess={handleRefreshOrders}
            isStatusModalOpen={isStatusModalOpen}
            getStatusIcon={getStatusIcon}
            selectedOrder={selectedOrder}
            setIsStatusModalOpen={setIsStatusModalOpen}
          />
        )}
      </div>
    </div>
  );
};

export default ManageOrder;

import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Search,
  Bell,
} from "lucide-react";

import { apiGetProducts } from "@/apis/product";
import { apiGetOrders } from "@/apis/order";
import RevenueChart from "@/components/Chart/RevenueChart";
import CategoryChart from "@/components/Chart/CategoryChart";
import PerformanceChart from "@/components/Chart/PerformanceChart";
import TopSellProduct from "@/components/Statistic/TopSellProduct";
import RecentOrders from "@/components/Statistic/RecentOrders";

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [bestSold, setBestSold] = useState(null);
  const [recentOrders, setRecentOrders] = useState(null);

  // Stats Data
  const statsCards = [
    {
      title: "Total Revenue",
      value: "₫245,890,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Orders",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Customers",
      value: "8,459",
      change: "+5.7%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Products",
      value: "456",
      change: "-2.3%",
      trend: "down",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ];

  const fetchBestSold = async () => {
    try {
      const response = await apiGetProducts({ sort: "-sold", limit: 4 });
      if (response.success && response.products) {
        setBestSold(response.products);
      }
    } catch (error) {
      console.error("Failed to fetch top selling products:", error);
    }
  };

  const fetchCurrentOrders = async () => {
    try {
      const response = await apiGetOrders({ limit: 5 });
      if (response.success && response.order) {
        setRecentOrders(response.order);
      }
    } catch (error) {
      console.error("Failed to fetch recent orders:", error);
    }
  };

  useEffect(() => {
    fetchBestSold();
    fetchCurrentOrders();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-600" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Export */}
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {/* Statistic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border ${stat.borderColor} cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      stat.trend === "up"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-2">
                  compared to last month
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <RevenueChart />
            {/* Category Distribution */}
            <CategoryChart />
          </div>

          {/* Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <PerformanceChart />
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentOrders recentOrders={recentOrders} />
            <TopSellProduct data={bestSold} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

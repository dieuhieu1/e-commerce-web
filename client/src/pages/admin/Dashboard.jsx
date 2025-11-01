import React, { useState } from "react";
import {
  LayoutDashboard,
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
  Settings,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30days");

  // Stats Data
  const statsCards = [
    {
      title: "Tổng Doanh Thu",
      value: "₫245,890,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Đơn Hàng",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Khách Hàng",
      value: "8,459",
      change: "+5.7%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Sản Phẩm",
      value: "456",
      change: "-2.3%",
      trend: "down",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ];

  // Revenue Chart Data
  const revenueData = [
    { month: "T1", revenue: 45, orders: 320 },
    { month: "T2", revenue: 52, orders: 380 },
    { month: "T3", revenue: 48, orders: 350 },
    { month: "T4", revenue: 61, orders: 420 },
    { month: "T5", revenue: 55, orders: 390 },
    { month: "T6", revenue: 67, orders: 450 },
    { month: "T7", revenue: 72, orders: 480 },
    { month: "T8", revenue: 69, orders: 460 },
  ];

  // Category Data
  const categoryData = [
    { name: "Điện Thoại", value: 35, color: "#3B82F6" },
    { name: "Laptop", value: 25, color: "#10B981" },
    { name: "Phụ Kiện", value: 20, color: "#8B5CF6" },
    { name: "Tablet", value: 12, color: "#F59E0B" },
    { name: "Khác", value: 8, color: "#EC4899" },
  ];

  // Performance Data
  const performanceData = [
    { category: "Điện Thoại", sales: 450, target: 400 },
    { category: "Laptop", sales: 380, target: 350 },
    { category: "Phụ Kiện", sales: 420, target: 380 },
    { category: "Tablet", sales: 280, target: 300 },
    { category: "Wearables", sales: 320, target: 280 },
  ];

  // Recent Orders
  const recentOrders = [
    {
      id: "#ORD-2024-001",
      customer: "Nguyễn Văn A",
      product: "iPhone 15 Pro Max",
      amount: 29990000,
      status: "completed",
      date: "2024-10-30",
    },
    {
      id: "#ORD-2024-002",
      customer: "Trần Thị B",
      product: "MacBook Air M2",
      amount: 28990000,
      status: "processing",
      date: "2024-10-30",
    },
    {
      id: "#ORD-2024-003",
      customer: "Lê Văn C",
      product: "AirPods Pro 2",
      amount: 5990000,
      status: "pending",
      date: "2024-10-29",
    },
    {
      id: "#ORD-2024-004",
      customer: "Phạm Thị D",
      product: 'iPad Pro 11"',
      amount: 21990000,
      status: "completed",
      date: "2024-10-29",
    },
    {
      id: "#ORD-2024-005",
      customer: "Hoàng Văn E",
      product: "Apple Watch Ultra 2",
      amount: 19990000,
      status: "cancelled",
      date: "2024-10-28",
    },
  ];

  // Top Products
  const topProducts = [
    {
      name: "iPhone 15 Pro Max",
      sold: 234,
      revenue: 70176600000,
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop",
      trend: "+15%",
    },
    {
      name: 'MacBook Pro 14"',
      sold: 156,
      revenue: 62244000000,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
      trend: "+12%",
    },
    {
      name: "AirPods Pro 2",
      sold: 445,
      revenue: 26655500000,
      image:
        "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=100&h=100&fit=crop",
      trend: "+8%",
    },
    {
      name: "Apple Watch Series 9",
      sold: 189,
      revenue: 18711100000,
      image:
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=100&h=100&fit=crop",
      trend: "+10%",
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-700 border-green-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      completed: "Hoàn thành",
      processing: "Đang xử lý",
      pending: "Chờ xử lý",
      cancelled: "Đã hủy",
    };
    return texts[status] || status;
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
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
                  <option value="7days">7 ngày qua</option>
                  <option value="30days">30 ngày qua</option>
                  <option value="90days">90 ngày qua</option>
                  <option value="year">Năm nay</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Download */}
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium">
                <Download className="w-4 h-4" />
                Xuất Báo Cáo
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {/* Stats Cards */}
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
                <p className="text-xs text-gray-500 mt-2">so với tháng trước</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Biểu Đồ Doanh Thu
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Theo dõi doanh thu theo tháng
                  </p>
                </div>
              </div>
              <div className="max-w-[1000px] full h-[300px]">
                <ResponsiveContainer>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Phân Loại Sản Phẩm
              </h2>
              <div className="max-w-[1000px] full h-[300px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {categoryData.map((cat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{cat.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {cat.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Hiệu Suất Theo Danh Mục
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                So sánh doanh số với mục tiêu
              </p>
            </div>
            <div className="max-w-full h-[300px]">
              <ResponsiveContainer>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="sales"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    name="Bán Được"
                  />
                  <Bar
                    dataKey="target"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    name="Mục Tiêu"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Đơn Hàng Gần Đây
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {recentOrders.length} đơn hàng mới nhất
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                    Xem tất cả
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Mã Đơn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Khách Hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Sản Phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Giá Trị
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Trạng Thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-blue-600">
                            {order.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800">
                            {order.customer}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {order.product}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-800">
                            {formatCurrency(order.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Sản Phẩm Bán Chạy
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Top 4 sản phẩm</p>
                </div>
              </div>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-800 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{product.sold} đã bán</span>
                        <span className="text-green-600 font-medium">
                          {product.trend}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-800">
                        {formatCurrency(product.revenue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Nav Item Component
const NavItem = ({ icon: Icon, text, badge, active, collapsed }) => {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
        active
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 font-medium text-sm">{text}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

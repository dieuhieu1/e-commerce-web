import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
// Revenue Chart Data
const revenueData = [
  { month: "Jan", revenue: 45, orders: 320 },
  { month: "Feb", revenue: 52, orders: 380 },
  { month: "Mar", revenue: 48, orders: 350 },
  { month: "Apr", revenue: 61, orders: 420 },
  { month: "May", revenue: 55, orders: 390 },
  { month: "Jun", revenue: 67, orders: 450 },
  { month: "Jul", revenue: 72, orders: 480 },
  { month: "Aug", revenue: 69, orders: 460 },
];
const RevenueChart = ({
  data = revenueData,
  title = "Revenue Overview",
  subtitle = "Monthly revenue trend",
}) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
      <div className="max-w-[1000px] full h-[300px]">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
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
  );
};

export default RevenueChart;

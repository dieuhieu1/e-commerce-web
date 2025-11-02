import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

// Performance Data
const performanceData = [
  { category: "Smartphones", sales: 450, target: 400 },
  { category: "Laptops", sales: 380, target: 350 },
  { category: "Accessories", sales: 420, target: 380 },
  { category: "Tablets", sales: 280, target: 300 },
  { category: "Wearables", sales: 320, target: 280 },
];
const PerformanceChart = ({
  data = performanceData,
  title = "Performance by Category",
  subtitle = "Compare sales to target",
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div className="max-w-full h-[300px]">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="sales"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              name="Actual Sales"
            />
            <Bar
              dataKey="target"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              name="Target"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;

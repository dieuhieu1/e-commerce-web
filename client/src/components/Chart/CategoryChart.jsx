import React from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import CustomTooltip from "./CustomTooltip";
// Category Data
const categoryData = [
  { name: "Smartphones", value: 35, color: "#3B82F6" },
  { name: "Laptops", value: 25, color: "#10B981" },
  { name: "Accessories", value: 20, color: "#8B5CF6" },
  { name: "Tablets", value: 12, color: "#F59E0B" },
  { name: "Others", value: 8, color: "#EC4899" },
];
const CategoryChart = ({
  data = categoryData,
  title = "Product Categories",
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="max-w-[1000px] full h-[300px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((cat, index) => (
          <div key={index} className="flex items-center justify-between">
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
  );
};

export default CategoryChart;

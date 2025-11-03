import React, { useEffect, useState } from "react";
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
import { apiGetDailyRevenue } from "@/apis/order";
import { formatCurrency } from "@/ultils/helpers";

// Daily Revenue Data

const PerformanceChart = ({
  data = null,
  title = "Daily Revenue",
  subtitle = "Compare real revenue with target revenue",
}) => {
  const [dailyRevenueData, setDailyRevenueData] = useState(null);
  const fetchDailyRevenue = async () => {
    try {
      const response = await apiGetDailyRevenue();
      if (response.success) {
        console.log(response);
        const convertedData = response.data.map((item) => ({
          ...item,
          totalRevenue: (item.totalRevenue * 25000).toFixed(1),
          target: (item.target * 25000).toFixed(1),
        }));
        console.log(convertedData);

        setDailyRevenueData(convertedData);
      }
    } catch (error) {
      throw new Error("Something went wrong while fetch daily revenue" + error);
    }
  };
  useEffect(() => {
    fetchDailyRevenue();
  }, []);
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div className="max-w-full h-[300px]">
        <ResponsiveContainer>
          <BarChart data={dailyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis
              width={150}
              stroke="#9CA3AF"
              tickFormatter={(value) =>
                value > 0 ? `${formatCurrency(value)} VND` : ""
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="totalRevenue"
              fill="#F97316"
              radius={[8, 8, 0, 0]}
              name="Real Revenue"
            />
            <Bar
              dataKey="target"
              fill="#10B981"
              radius={[8, 8, 0, 0]}
              name="Target Revenue"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;

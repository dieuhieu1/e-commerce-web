import { apiGetDashboardStats } from "@/apis/order";
import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cardConfig } from "@/ultils/constants";
import { formatCurrencyVND } from "@/ultils/helpers";

const StatsCard = () => {
  const [statsCard, setStatsCard] = useState(null);
  // Stats Data
  const fetchOrderStats = async () => {
    try {
      const response = await apiGetDashboardStats();
      if (response.success) {
        const statsData = response.stats;
        const formatedCard = cardConfig.map((el) => {
          const value = statsData[el.dataKey];
          return el.dataKey === "totalRevenue"
            ? { ...el, value: formatCurrencyVND(value * 25000) }
            : { ...el, value: value };
        });
        setStatsCard(formatedCard);
      }
    } catch (error) {
      console.error("Failed to fetch recent orders:", error);
    }
  };
  useEffect(() => {
    fetchOrderStats();
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCard?.map((stat, index) => (
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
          <p className="text-xs text-gray-500 mt-2">compared to last month</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;

import {
  formatCurrencyVND,
  getStatusColor,
  getStatusText,
} from "@/ultils/helpers";
import React from "react";
import { ArrowUpRight } from "lucide-react";
const RecentOrders = ({ recentOrders }) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <p className="text-sm text-gray-500 mt-1">
              {recentOrders?.length} latest orders
            </p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
            View All
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentOrders?.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Customer */}
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                  <img
                    src={
                      order.orderedBy?.avatar?.image_url ||
                      "/default-avatar.png"
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {order.orderedBy?.lastname} {order.orderedBy?.firstname}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.orderedBy?._id}
                    </p>
                  </div>
                </td>

                {/* Order ID */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-blue-600">
                    {order._id}
                  </span>
                </td>

                {/* Products */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {order.products.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <img
                          src={item?.thumb || "/default-thumb.png"}
                          alt={item?.title}
                          className="w-8 h-8 object-cover rounded-md"
                        />
                        <span className="text-sm text-gray-700 truncate max-w-[200px]">
                          {item?.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>

                {/* Total */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-800">
                    {formatCurrencyVND(order.total * 25000)}
                  </span>
                </td>

                {/* Status */}
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
  );
};

export default RecentOrders;

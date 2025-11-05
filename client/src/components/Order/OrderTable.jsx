import {
  formatCurrencyVND,
  formatDate,
  getStatusColor,
} from "@/ultils/helpers";
import React from "react";

import { Eye, Edit, Trash2, ArrowUpDown, Loader2 } from "lucide-react";
import ManagePagination from "../Pagination/MangePagination";

const OrderTable = ({
  getStatusIcon,
  handleViewDetails,
  handleClickUpdateStatusBtn,
  orders,
  isLoading,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Pagination */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <button className="flex items-center gap-1 hover:text-gray-900">
                  Order ID
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <button className="flex items-center gap-1 hover:text-gray-900">
                  Total
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <button className="flex items-center gap-1 hover:text-gray-900">
                  Date
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : orders?.order && orders.order.length > 0 ? (
              orders.order.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-blue-600">
                      {order._id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.orderedBy.avatar.image_url}
                        alt={order.orderedBy.firsname}
                        className="w-10 h-10 rounded-full  object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.orderedBy.firstname +
                            " " +
                            order.orderedBy.lastname}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.orderedBy.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {order.products.slice(0, 3).map((product, idx) => (
                          <img
                            key={idx}
                            src={product.thumb}
                            alt={product.title}
                            className="w-8 h-8 rounded border-2 border-white"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {order.products.length} item(s)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">
                      {formatCurrencyVND(order.total * 25000)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900 font-medium">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>

                      <button
                        onClick={() => handleClickUpdateStatusBtn(order)}
                        disabled={order.status === "Cancelled"}
                        className={`p-2 rounded-lg transition-colors group ${
                          order.status === "Cancelled"
                            ? "cursor-not-allowed opacity-50 bg-gray-100"
                            : "hover:bg-green-50"
                        }`}
                        title={
                          order.status === "Cancelled"
                            ? "This order is cancelled and cannot be updated"
                            : "Update Status"
                        }
                      >
                        <Edit
                          className={`w-4 h-4 ${
                            order.status === "Cancelled"
                              ? "text-gray-400"
                              : "text-gray-600 group-hover:text-green-600"
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No orders found
                    </h3>
                    <p className="text-sm text-gray-500">
                      There are no orders to display at the moment.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ManagePagination pageSize={5} totalCount={orders?.totalCount} />
    </div>
  );
};

export default OrderTable;

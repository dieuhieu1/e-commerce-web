import { formatCurrencyVND } from "@/ultils/helpers";
import { Package } from "lucide-react";

const OrderStatistics = ({ summary }) => {
  return (
    <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
      <div className="flex items-center gap-4 mb-4">
        <Package size={40} />
        <div>
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-orange-100">Track and manage all your orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="text-orange-100 text-sm">Total Orders</p>
          <p className="text-3xl font-bold">{summary.totalOrders}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="text-orange-100 text-sm">Completed</p>
          <p className="text-3xl font-bold">{summary.completedOrders}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="text-orange-100 text-sm">Total Spent</p>
          <p className="text-2xl font-bold">
            {formatCurrencyVND(summary.totalSpent)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatistics;

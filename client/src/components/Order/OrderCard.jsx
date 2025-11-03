import {
  formatCurrencyVND,
  formatDate,
  getStatusConfig,
} from "@/ultils/helpers";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Package,
  XCircle,
} from "lucide-react";

const OrderCard = ({ order, isExpanded, onToggleExpand, onCancelOrder }) => {
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const canCancel = order.status === "Pending" || order.status === "Processing";

  return (
    <>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Package className="text-orange-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Order #{order._id.slice(-8).toUpperCase()}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar size={14} />
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-orange-600">
                {formatCurrencyVND(order.total * 25000)}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-lg border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} flex items-center gap-2`}
            >
              <StatusIcon size={18} />
              <span className="font-semibold">{statusConfig.label}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {order.products.length}{" "}
            {order.products.length === 1 ? "item" : "items"}
          </p>
          <div className="flex items-center gap-4">
            {canCancel && (
              <button
                onClick={() => onCancelOrder(order._id)}
                className="group relative flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <XCircle
                  size={18}
                  className="relative z-10 group-hover:rotate-90 transition-transform duration-300"
                />
                <span className="relative z-10">Cancel Order</span>
              </button>
            )}

            <button
              onClick={() => onToggleExpand(order._id)}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
            >
              {isExpanded ? (
                <>
                  <span>Hide Details</span>
                  <ChevronUp size={18} />
                </>
              ) : (
                <>
                  <span>View Details</span>
                  <ChevronDown size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default OrderCard;

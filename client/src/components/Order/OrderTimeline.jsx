import { formatDate } from "@/ultils/helpers";
import { CheckCircle } from "lucide-react";

const OrderTimeline = ({ order, statusConfig }) => {
  const StatusIcon = statusConfig.icon;

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-4">Order Timeline</h4>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <CheckCircle className="text-green-600" size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Order Placed</p>
            <p className="text-xs text-gray-600">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
            <StatusIcon className={statusConfig.textColor} size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {statusConfig.label}
            </p>
            <p className="text-xs text-gray-600">
              {formatDate(order.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderTimeline;

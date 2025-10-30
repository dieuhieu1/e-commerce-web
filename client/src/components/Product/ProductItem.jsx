import { formatCurrencyVND } from "@/ultils/helpers";

const ProductItem = ({ item }) => {
  return (
    <div className="bg-white rounded-lg p-4 flex gap-4">
      <img
        src={item.thumb || "https://via.placeholder.com/80"}
        alt={item.title}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h5 className="font-semibold text-gray-900 mb-1">{item.title}</h5>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span className="font-medium">Color:</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded">
              {item.color}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span className="font-medium">Qty:</span>
            <span>{item.quantity}</span>
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-orange-600">
          {formatCurrencyVND(item.price)}
        </p>
        {item.quantity > 1 && (
          <p className="text-sm text-gray-600">
            {formatCurrencyVND(item.price * item.quantity)} total
          </p>
        )}
      </div>
    </div>
  );
};
export default ProductItem;

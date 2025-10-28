import { formatCurrency } from "@/ultils/helpers";
import Button from "../Common/Button";
import { ShoppingCart, Trash2 } from "lucide-react"; // Cart and trash icons
import { apiRemoveProductFromCart } from "@/apis/user";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/zustand/useAuthStore";

export const CartItem = ({ item }) => {
  const { checkAuth } = useAuthStore();
  const removeProduct = async () => {
    const data = { color: item.color, title: item.title };
    const response = await apiRemoveProductFromCart(item.product._id, data);
    if (response.success) {
      toast.success(response.message);
      checkAuth();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="flex items-center gap-6 w-full ">
      <img
        src={item?.thumb}
        alt={item?.title}
        className="w-20 h-20 object-cover rounded-md border"
      />
      <div className="flex-1">
        <h4 className="font-medium truncate text-main">{item?.title}</h4>
        <p className="text-sm text-gray-500">Quantity: {item?.quantity}</p>
        <p className="text-sm text-gray-500">Color: {item.color}</p>

        <p className="font-medium text-base">
          {formatCurrency(item?.price)} VND
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-500 hover:text-red-500 cursor-pointer hover:bg-red-200 p-2"
        onClick={removeProduct}
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
};

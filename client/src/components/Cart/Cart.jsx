import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"; // (1) Import Sheet components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BsHandbagFill } from "react-icons/bs";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { formatCurrency } from "@/ultils/helpers";
import { CartItem } from "./CartItem";
import { useNavigate } from "react-router-dom";
import path from "@/ultils/path";

export function Cart() {
  //  Get data from the store
  const { user } = useAuthStore();
  const navigate = useNavigate();
  // Calculate total item count from the user's cart
  const itemCount =
    user?.cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Calculate subtotal from the user's cart
  const subtotal =
    user?.cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0; // Calculate this from your logic
  const handleNavigateCheckout = () => {
    const url = `/${path.CHECK_OUT}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <Sheet>
      {/* === CART TRIGGER BUTTON === */}
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <BsHandbagFill color="red" size={20} />

          {/* (2) Use Badge to display the count */}
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
            {itemCount}
          </Badge>
        </Button>
      </SheetTrigger>

      {/* === CART CONTENT (Slides out) === */}
      {/* Thêm sm:max-w-lg để làm sheet rộng hơn trên màn hình sm trở lên */}
      <SheetContent className="flex flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl">
            Your cart ({itemCount} products)
          </SheetTitle>
        </SheetHeader>

        {/* (3) Use ScrollArea to wrap the list - Đã sửa lại class */}
        <ScrollArea className="flex-1 pr-5">
          {!user?.cart || user.cart.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              Your cart is empty
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Make sure item has a unique key, e.g., item._id */}
              {user.cart.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* (4) Cart Footer section */}
        {/* This footer now correctly checks if user.cart has items */}
        {user?.cart?.length > 0 && (
          <SheetFooter className="mt-6 pt-4 border-t">
            <div className="w-full space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Pay:</span>
                <span>{formatCurrency(subtotal)} VND</span>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Shipping and taxes will be calculated at checkout.
              </p>

              {/* Checkout and Close Buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full cursor-pointer bg-main hover:bg-red-700"
                  onClick={handleNavigateCheckout}
                >
                  Proceed to Checkout
                </Button>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={() => navigate(`/${path.DETAIL_CART}`)}
                  >
                    Shopping Cart
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

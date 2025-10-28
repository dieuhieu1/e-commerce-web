import React from "react";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { formatCurrency } from "@/ultils/helpers";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { DetailCartItem } from "./DetailCartItem"; // Import component hàng
import path from "@/ultils/path";

const DetailCart = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Tính toán tổng tiền
  const subtotal =
    user?.cart?.reduce((acc, item) => acc + item?.price * item.quantity, 0) ||
    0;

  const handleNavigateCheckout = () => {
    const url = `/${path.CHECK_OUT}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Xử lý trường hợp giỏ hàng trống
  if (!user?.cart || user.cart.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBag size={80} className="text-gray-300 mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft size={18} className="mr-2" />
          Continue Shopping
        </Button>
      </div>
    );
  }

  // Giao diện khi giỏ hàng có đồ
  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <Button
          variant="link"
          onClick={() => navigate("/")}
          className="cursor-pointer"
        >
          <ArrowLeft size={16} className="mr-2" />
          Continue Shopping
        </Button>
      </div>

      {/* Layout 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Danh sách sản phẩm */}
        <div className="lg:col-span-2">
          <div className="flex flex-col">
            {/* Header của bảng */}
            <div className="hidden md:grid grid-cols-10 gap-4 text-sm font-medium text-gray-500 uppercase py-4 border-b">
              <span className="col-span-3">Product</span>
              <span className="text-center col-span-2">Price</span>
              <span className="text-center ">Quantity</span>
              <span className="text-right col-span-2">Total</span>
              <span className="text-right col-span-2">Remove</span>
            </div>

            {/* Danh sách item */}
            <div className="divide-y">
              {user.cart.map((item) => (
                <DetailCartItem key={item._id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Tóm tắt đơn hàng */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)} VND</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-right">Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(subtotal)} VND</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleNavigateCheckout}
              >
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailCart;

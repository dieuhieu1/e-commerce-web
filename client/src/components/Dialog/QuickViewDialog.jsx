import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatMoney } from "@/ultils/helpers";
import StarRating from "../StarRating";
import { Minus, Plus } from "lucide-react"; // Import icons cho quantity
import { useNavigate } from "react-router-dom";

const QuickViewDialog = ({ open, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // Reset số lượng về 1 mỗi khi mở xem sản phẩm mới
  useEffect(() => {
    if (open) {
      setQuantity(1);
    }
  }, [open, product]);

  if (!product) return null;

  const {
    thumb,
    slug,
    title,
    price,
    totalRatings,
    description,
    originalPrice,
  } = product;
  const hasDiscount = originalPrice && originalPrice > price;

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount)); // Đảm bảo số lượng không bao giờ < 1
  };

  const handleViewDetails = () => {
    onClose(); // Đóng modal
    navigate(
      `/${product?.category?.toLowerCase()}/${product?._id}/${product?.title}`
    ); // Điều hướng đến trang chi tiết
    console.log("Navigating to product:", slug); // Tạm thời log ra
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${title} to cart.`);
    // Thêm logic add to cart ở đây
    onClose(); // Đóng modal sau khi thêm
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* Tăng chiều rộng tối đa của modal */}
      <DialogContent className="sm:max-w-3xl p-0">
        {/* Chia modal thành 2 cột trên màn hình md trở lên */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* === CỘT BÊN TRÁI (HÌNH ẢNH) === */}
          <div className="w-full aspect-square bg-gray-100 flex items-center justify-center p-6 rounded-l-lg">
            <img
              src={
                thumb?.image_url || "https://via.placeholder.com/400" // Ảnh dự phòng tốt hơn
              }
              alt={slug}
              className="w-full h-full object-contain"
            />
          </div>

          {/* === CỘT BÊN PHẢI (THÔNG TIN) === */}
          <div className="flex flex-col p-6 md:p-8">
            {/* Header chứa Title và Rating */}
            <DialogHeader className="p-0 text-left mb-3">
              <DialogTitle className="text-2xl font-bold mb-2 tracking-tight">
                {title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <StarRating rating={totalRatings} size={18} />
                <span className="text-sm text-gray-500 ml-1">
                  ({totalRatings || 0} reviews)
                </span>
              </div>
            </DialogHeader>

            {/* Giá (có xử lý giảm giá) */}
            <div className="my-3">
              {hasDiscount ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-600">
                    {formatMoney(price)} VND
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {formatMoney(originalPrice)} VND
                  </span>
                </div>
              ) : (
                <div className="text-3xl font-bold text-gray-900">
                  {formatMoney(price)} VND
                </div>
              )}
            </div>

            {/* Mô tả ngắn (dùng line-clamp) */}
            <DialogDescription className="text-base text-gray-600 line-clamp-4 mt-1 mb-5">
              {description || "No description available."}
            </DialogDescription>

            {/* Đẩy các action xuống dưới cùng */}
            <div className="flex-1"></div>

            {/* Bộ chọn số lượng */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-md transition disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-5 py-1.5 text-base font-medium min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-md transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Các nút hành động */}
            <div className="flex flex-col gap-3">
              {/* Nút chính: Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full px-4 py-3 bg-main text-white rounded-lg hover:bg-main/80 transition text-base font-semibold"
              >
                Add to Cart
              </button>
              {/* Nút phụ: View Detail */}
              <button
                onClick={handleViewDetails}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-base font-semibold"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewDialog;

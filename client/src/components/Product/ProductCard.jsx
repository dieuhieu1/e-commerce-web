import React from "react";
import { formatMoney } from "@/ultils/helpers";
import StarRating from "../StarRating";
// Import icons
import { FiEye, FiHeart, FiShoppingCart } from "react-icons/fi";

const ProductCard = ({ productData }) => {
  // Giả sử productData có thể có 'originalPrice' để tính giảm giá
  const { title, thumb, totalRatings, price, originalPrice } = productData;

  const hasDiscount = originalPrice && originalPrice > price;

  // Bạn có thể thêm một hàm xử lý click cho toàn bộ card ở đây
  // Ví dụ: const handleCardClick = () => { /* navigate to product detail */ };

  return (
    // Thêm hiệu ứng scale cho toàn bộ card khi hover
    <div className="group w-full sm:w-1/2 lg:w-1/3 p-2">
      <div
        className="bg-white rounded-lg shadow-sm hover:shadow-xl 
                   transition-all duration-300 flex flex-col h-full overflow-hidden 
                   border border-gray-100 
                   transform hover:scale-105 cursor-pointer" // Thêm transform và hover:scale-105
        // Nếu muốn cả card click được, thêm onClick={handleCardClick} ở đây
      >
        {/* === IMAGE CONTAINER === */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
          <img
            src={thumb?.image_url || "/placeholder-image.png"} // Thêm ảnh dự phòng
            alt={title}
            className="object-contain w-full h-full p-4 transition-transform duration-500 ease-out"
          />

          {/* --- Sale Badge --- */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10">
              SALE
            </div>
          )}

          {/* --- Hover Actions (Quick View, Wishlist, Cart) --- */}
          <div
            className="absolute inset-0 bg-black/20 flex items-center justify-center gap-3
                       opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <button
              className="bg-white p-2 rounded-full text-gray-800 shadow-md 
                         hover:bg-blue-600 hover:text-white 
                         transition-all duration-200 hover:scale-150"
              title="Quick View"
            >
              <FiEye size={20} />
            </button>
            <button
              className="bg-white p-2 rounded-full text-gray-800 shadow-md 
                         hover:bg-blue-600 hover:text-white 
                         transition-all duration-200 hover:scale-150"
              title="Add to Wishlist"
            >
              <FiHeart size={20} />
            </button>
            <button
              className="bg-white p-2 rounded-full text-gray-800 shadow-md 
                         hover:bg-blue-600 hover:text-white 
                         transition-all duration-200 hover:scale-150"
              title="Add to Cart"
            >
              <FiShoppingCart size={20} />
            </button>
          </div>
        </div>

        {/* === PRODUCT INFO === */}

        <div className="flex flex-col flex-1 p-4 h-40">
          {/* --- Title --- */}
          <h3
            className="text-base font-medium text-gray-800 line-clamp-2 capitalize mb-1 
                       group-hover:text-blue-600 transition-colors duration-200"
            title={title}
          >
            {title?.toLowerCase()}
          </h3>

          {/* --- Rating --- */}
          <div className="flex items-center gap-1 h-5 mb-2">
            <StarRating rating={totalRatings} size={16} />
            <span className="text-xs text-gray-500 ml-1">
              ({totalRatings || 0} reviews)
            </span>
          </div>

          {/* --- Price (Pushes to bottom) --- */}
          <div className="mt-auto">
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-red-600">
                  {formatMoney(price)} VND
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatMoney(originalPrice)} VND
                </span>
              </div>
            ) : (
              <div className="text-xl font-bold text-gray-900">
                {formatMoney(price)} VND
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

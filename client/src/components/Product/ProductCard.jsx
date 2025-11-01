import React, { useState } from "react";
import { formatMoney } from "@/ultils/helpers";
import StarRating from "../StarRating";
// Import icons
import { FiEye, FiHeart, FiShoppingCart } from "react-icons/fi";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import toast from "react-hot-toast";
import { apiUpdateUserCart, apiUpdateWishlist } from "@/apis/user";
import path from "@/ultils/path";
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { CustomDialog } from "../Dialog/CustomDialog";
import QuickViewDialog from "../Dialog/QuickViewDialog";
import { BsFillCartCheckFill, BsFillSuitHeartFill } from "react-icons/bs";
import SelectOption from "../Search/SelectOption";
import { FaHeart, FaHeartCircleCheck } from "react-icons/fa6";

const ProductCard = ({ productData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get user state and auth-checking function from Zustand store
  const { user, checkAuth } = useAuthStore();
  // --- COMPONENT STATE ---
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [openQuickView, setOpenQuickView] = useState(false);

  // Destructure product data for easier access
  const {
    _id,
    title,
    thumb,
    totalRatings,
    price,
    category,
    originalPrice,
    color,
  } = productData;
  // --- DERIVED STATE & VARS ---

  // Construct the navigation path for the product detail page
  const productPath = `/${category?.toLowerCase()}/${_id}/${title}`;
  const hasDiscount = originalPrice && originalPrice > price;
  // Check if this product is already in the user's cart
  const isProductInCart = user?.cart?.some((el) => el?.product?._id === _id);
  const isProductInWishlist = user?.wishlist?.some((el) => el === _id);

  // --- EVENT HANDLERS ---

  /**
   * Handles clicks on the hover icons (Quick View, Cart, Wishlist).
   * @param {React.MouseEvent} e - The click event.
   * @param {'CART' | 'QUICK_VIEW' | 'WISH_LIST'} flag - Identifies which icon was clicked.
   */
  const handleClickOpions = async (e, flag) => {
    e.stopPropagation(); // CRITICAL: Prevents the click from bubbling up to the parent <Link> and navigating.

    // --- CART LOGIC ---
    if (flag === "CART") {
      // User must be logged in to add to cart
      if (!user) {
        setIsLoginModalOpen(true);
        return;
      }

      const toastId = toast.loading("Adding to cart...");
      // 'color' might be a default or first variant. Adjust as needed.
      const data = {
        color: color,
        title: title,
        price: price,
        thumb: thumb.image_url,
        quantity: 1,
      };
      const productId = _id;
      const response = await apiUpdateUserCart(productId, data);

      if (response.success) {
        toast.success(response.message, { id: toastId });
        checkAuth(); // Re-fetch user data to update cart state globally
      } else {
        toast.error(response.message, { id: toastId });
      }
    }

    // --- QUICK VIEW LOGIC ---
    if (flag === "QUICK_VIEW") {
      setOpenQuickView(true);
    }

    // --- WISHLIST LOGIC ---
    if (flag === "WISH_LIST") {
      if (!user) {
        setIsLoginModalOpen(true);
        return;
      }
      const productId = _id;
      const response = await apiUpdateWishlist({ pid: productId });

      if (response.success) {
        toast.success(response.message);
        checkAuth(); // Re-fetch user data to update cart state globally
      } else {
        toast.error(response.message);
      }
    }
  };
  const handleConfirmLoginModal = () => {
    navigate({
      pathname: `/${path.LOGIN}`,
      search: createSearchParams({ redirect: location.pathname }).toString(),
    });
    setIsLoginModalOpen(false);
  };
  return (
    <div className="group w-full sm:w-1/2 lg:w-1/3 p-2">
      <div
        className="bg-white rounded-lg shadow-sm hover:shadow-xl 
                   transition-all duration-300 flex flex-col h-full overflow-hidden 
                   border border-gray-100 
                   transform hover:scale-105 cursor-pointer"
      >
        {/* === IMAGE CONTAINER === */}
        <div
          className="relative w-full aspect-square overflow-hidden bg-gray-50"
          onClick={() => navigate(productPath)}
        >
          <img
            src={thumb?.image_url || "/placeholder-image.png"}
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
              onClick={(e) => handleClickOpions(e, "QUICK_VIEW")}
            >
              <FiEye size={20} />
            </button>

            {isProductInCart ? (
              <button
                className="bg-white p-2 rounded-full text-gray-800 shadow-md 
              hover:bg-green-600 hover:text-white 
              transition-all duration-200 hover:scale-150 cursor-not-allowed"
                title="Add to Cart"
                onClick={(e) => handleClickOpions(e, "CART")}
              >
                <BsFillCartCheckFill size={20} />
              </button>
            ) : (
              <button
                className="bg-white p-2 rounded-full text-gray-800 shadow-md 
              hover:bg-blue-600 hover:text-white 
              transition-all duration-200 hover:scale-150"
                title="Add to Cart"
                onClick={(e) => handleClickOpions(e, "CART")}
              >
                <FiShoppingCart size={20} />
              </button>
            )}
            {isProductInWishlist ? (
              // Nếu sản phẩm đã có trong wishlist
              <span
                title="Added to wishlist"
                onClick={(e) => e.stopPropagation()}
                className="cursor-not-allowed transition-transform duration-200 hover:scale-110"
              >
                <div className="opacity-60">
                  <SelectOption
                    icon={<FaHeartCircleCheck color="green" size={20} />}
                  />
                </div>
              </span>
            ) : (
              // Nếu sản phẩm chưa có trong wishlist
              <span
                title="Add to Wishlist"
                onClick={(e) => handleClickOpions(e, "WISH_LIST")}
                className="bg-white p-2 rounded-full text-gray-800 shadow-md 
              hover:bg-blue-600 hover:text-white 
              transition-all duration-200 hover:scale-150"
              >
                <FaHeart size={20} />
              </span>
            )}
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

      {/* Login Required Dialog */}
      <CustomDialog
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Login Required!"
        confirmText="Go to Login Page"
        cancelText="Not now!"
        onConfirm={handleConfirmLoginModal}
        // The "Not now" (cancel) button should close *this* modal
        onClose={() => setIsLoginModalOpen(false)}
      >
        <p className="text-gray-700 text-md">
          Please login your account Digital World to add product to your own
          cart.
        </p>
      </CustomDialog>

      {/* Quick View Dialog */}
      <QuickViewDialog
        open={openQuickView}
        onClose={() => setOpenQuickView(false)}
        product={productData}
      />
    </div>
  );
};

export default ProductCard;

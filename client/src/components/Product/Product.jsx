import { formatMoney } from "@/ultils/helpers";
import React, { useState } from "react";
import StarRating from "../StarRating";
import SelectOption from "../Search/SelectOption"; // A reusable component for the hover icons
import { AiFillEye } from "react-icons/ai";
import {
  BsCartPlus,
  BsFillCartCheckFill,
  BsFillSuitHeartFill,
} from "react-icons/bs";
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import QuickViewDialog from "../Dialog/QuickViewDialog";
import path from "@/ultils/path";
import { CustomDialog } from "../Dialog/CustomDialog";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { apiUpdateUserCart } from "@/apis/user";
import toast from "react-hot-toast";

/**
 * A single product card component that displays product information
 * and provides actions like Quick View, Add to Cart, and Wishlist.
 *
 * @param {object} props
 * @param {object} props.productData - The full product object.
 * @param {boolean} [props.isNew] - Flag to show a "NEW" badge.
 * @param {boolean} [props.normal] - If true, hides the "NEW" or "TRENDING" badge.
 */
const Product = ({ productData, isNew, normal }) => {
  const location = useLocation();

  const navigate = useNavigate();
  // Get user state and auth-checking function from Zustand store
  const { user, checkAuth } = useAuthStore();

  // --- COMPONENT STATE ---
  const [isShowOption, setIsShowOption] = useState(false); // Controls visibility of hover options (Cart, View, Wishlist)
  const [openQuickView, setOpenQuickView] = useState(false); // Toggles the Quick View modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Toggles the "Please Login" modal

  // Destructure product data for easier access
  const { _id, thumb, title, price, totalRatings, category, color } =
    productData;

  // --- DERIVED STATE & VARS ---

  // Construct the navigation path for the product detail page
  const productPath = `/${category?.toLowerCase()}/${_id}/${title}`;
  // Check if this product is already in the user's cart
  const isProductInCart = user?.cart?.some((el) => el?.product?._id === _id);

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
      // Placeholder for wishlist API call
      toast.success("Added to wishlist (demo)");
      // const response = await apiUpdateWishlist...
    }
  };

  /**
   * Handles the 'Confirm' action on the login modal.
   * Navigates the user to the login page.
   */
  const handleConfirmLoginModal = () => {
    navigate({
      pathname: `/${path.LOGIN}`,
      search: createSearchParams({ redirect: location.pathname }).toString(),
    });
    setIsLoginModalOpen(false);
  };

  /**
   * A safe wrapper function to close the Quick View modal.
   * This prevents passing the 'setState' function directly as a prop.
   */
  const handleCloseQuickView = () => {
    setOpenQuickView(false);
  };

  // --- RENDER ---
  return (
    <>
      {/* This is the main card container.
        'group' is a Tailwind utility that allows child elements to change style based on this parent's hover state.
      */}
      <div
        className="group w-full text-base bg-white border border-gray-200 rounded-lg overflow-hidden
                   shadow-sm hover:shadow-xl transition-all duration-300 relative"
        // We use onMouseEnter/Leave on the parent to control the 'isShowOption' state.
        onMouseEnter={() => setIsShowOption(true)}
        onMouseLeave={() => setIsShowOption(false)}
      >
        {/* === 1. IMAGE & ACTIONS CONTAINER === */}
        <div className="relative w-full overflow-hidden bg-gray-50">
          {/* The main link to the product detail page. Wraps the image. */}
          <Link to={productPath}>
            <img
              src={
                thumb?.image_url ||
                "https://www.allaboardeducators.com/images/productimages/1.jpg" // Fallback image
              }
              alt={title}
              className="w-full h-full object-contain aspect-square p-4 
                         transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Hover actions container. Fades in/slides up on hover. */}
          <div
            className={`absolute bottom-4 left-0 right-0 flex justify-center gap-2
             transition-all duration-300 ease-in-out
             ${
               isShowOption
                 ? "opacity-100 translate-y-0"
                 : "opacity-0 translate-y-4"
             }`}
          >
            {/* Quick View Button */}
            <span
              title="Quick View"
              onClick={(e) => handleClickOpions(e, "QUICK_VIEW")}
              // Thêm class transition
              className="transition-transform duration-200 hover:scale-125 cursor-pointer"
            >
              <SelectOption icon={<AiFillEye />} />
            </span>

            {/* Add to Cart Button (Conditional) */}
            {isProductInCart ? (
              // --- "DISABLED" CART BUTTON ---
              <span
                title="Added to cart"
                onClick={(e) => e.stopPropagation()}
                // Thêm class transition
                className="cursor-not-allowed transition-transform duration-200 hover:scale-125"
              >
                <div className="opacity-60">
                  <SelectOption icon={<BsFillCartCheckFill color="green" />} />
                </div>
              </span>
            ) : (
              // --- "ACTIVE" CART BUTTON ---
              <span
                title="Add to cart"
                onClick={(e) => handleClickOpions(e, "CART")}
                // Thêm class transition
                className="transition-transform duration-200 hover:scale-125 cursor-pointer"
              >
                <SelectOption icon={<BsCartPlus />} />
              </span>
            )}

            {/* Wishlist Button */}
            <span
              title="Add to Wishlist"
              onClick={(e) => handleClickOpions(e, "WISH_LIST")}
              // Thêm class transition
              className="transition-transform duration-200 hover:scale-125 cursor-pointer"
            >
              <SelectOption icon={<BsFillSuitHeartFill />} />
            </span>
          </div>

          {/* "NEW" or "TRENDING" Badge */}
          {!normal && (
            <span
              className={`absolute top-2 right-2 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md ${
                isNew ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              {isNew ? "NEW" : "TRENDING"}
            </span>
          )}
        </div>

        {/* === 2. PRODUCT INFO CONTAINER === */}
        {/* Fixed height (h-28) and flex-col ensure all cards in a row have the same layout.
          'items-start' aligns text to the left for a cleaner look.
        */}
        <div className="p-4 flex flex-col items-start h-28">
          <Link to={productPath} className="w-full">
            <span className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-main">
              {title}
            </span>
          </Link>
          <div className="flex items-center my-1.5">
            <StarRating rating={totalRatings} size={16} />
            <span className="text-xs text-gray-400 ml-1.5">
              ({totalRatings || 0})
            </span>
          </div>
          {/* 'mt-auto' pushes the price to the bottom of the 'h-28' container, aligning all prices. */}
          <span className="mt-auto text-base font-semibold text-main">
            {formatMoney(price)} VND
          </span>
        </div>
      </div>

      {/* === MODALS / DIALOGS ===
        These are placed *outside* the main card div.
        This is best practice to prevent any potential click event conflicts.
      */}
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

      <QuickViewDialog
        open={openQuickView}
        onClose={handleCloseQuickView} // Use the safe wrapper function
        product={productData}
      />
    </>
  );
};

export default Product;

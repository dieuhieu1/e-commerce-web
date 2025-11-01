import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, Trash2, X } from "lucide-react";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { toast } from "react-hot-toast";
import { formatCurrencyVND } from "@/ultils/helpers";
import { apiUpdateUserCart, apiUpdateWishlist } from "@/apis/user";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import { useNavigate } from "react-router-dom";

const WishList = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuthStore();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [isSticky, setIsSticky] = useState(false);
  const [open, setOpen] = useState(false);

  // Load wishlist ban đầu
  useEffect(() => {
    if (user?.wishlist) setWishlistItems(user.wishlist);
  }, [user]);

  // Sticky header
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Xóa 1 sản phẩm khỏi wishlist
  const removeFromWishlist = async (id) => {
    try {
      const response = await apiUpdateWishlist({ pid: id });
      if (response.success) {
        setWishlistItems(wishlistItems.filter((item) => item._id !== id));
        toast.success("Removed from your wishlist!", {
          icon: "🗑️",
          style: {
            borderRadius: "12px",
            background: "#333",
            color: "#fff",
            padding: "16px",
          },
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (item) => {
    try {
      const data = {
        color: item.color,
        title: item.title,
        price: item.price,
        thumb: item.thumb.image_url,
        quantity: 1,
      };
      const response = await apiUpdateUserCart(item._id, data);

      if (response.success) {
        toast.success(`"${item.title}" has been added to your cart! 🛒`, {
          icon: "✅",
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#10B981",
            color: "#fff",
            padding: "16px",
          },
        });
        checkAuth(); // cập nhật lại thông tin user
      } else toast.error(response.message);
    } catch (error) {
      toast.error("Unable to add to cart!");
    }
  };

  // Xóa toàn bộ wishlist
  const clearWishlist = async () => {
    try {
      const response = await apiUpdateWishlist({ isClearAll: true });
      if (response.success) {
        setWishlistItems([]);
        checkAuth();
        toast.success("Wishlist cleared!", {
          icon: "🗑️",
          style: {
            borderRadius: "12px",
            background: "#333",
            color: "#fff",
            padding: "16px",
          },
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    }
  };

  const totalValue = wishlistItems.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div
        className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
          isSticky
            ? "py-2 bg-gradient-to-r from-purple-700 via-pink-700 to-rose-700 shadow-lg"
            : "py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600"
        } text-white`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-10 h-10 fill-white" />
                <h1
                  className={`text-4xl font-bold tracking-tight transition-all duration-300 ${
                    isSticky ? "text-[22px]" : ""
                  }`}
                >
                  My Wishlist
                </h1>
              </div>
              {!isSticky && (
                <p className="text-white/90 text-lg">
                  {wishlistItems.length}{" "}
                  {wishlistItems.length === 1 ? "item" : "items"} you love
                </p>
              )}
            </div>

            {wishlistItems.length > 0 && (
              <div
                className={`bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 transition-all duration-500 flex items-center justify-center ${
                  isSticky ? "px-4 py-2 text-base" : "px-6 py-4 text-lg"
                }`}
              >
                <div
                  className={`text-white/80 transition-all ${
                    isSticky ? "text-xs" : "text-sm"
                  }`}
                >
                  Total Value:
                </div>
                <div
                  className={`font-bold ml-2 transition-all ${
                    isSticky ? "text-xs" : "text-3xl"
                  }`}
                >
                  {formatCurrencyVND(totalValue)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        {wishlistItems.length > 0 && (
          <div className="mb-8 flex justify-between items-center">
            <span className="px-4 py-2 bg-white rounded-lg font-medium text-gray-700 shadow-sm border border-gray-200">
              {wishlistItems.length} items
            </span>
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
        )}

        {/* Wishlist Grid */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6">
              <Heart className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Add some products you love to see them here!
            </p>
            <button
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => navigate("/products")}
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200"
              >
                <div className="relative overflow-hidden bg-gray-50">
                  <img
                    src={
                      item.thumb?.image_url || "https://via.placeholder.com/500"
                    }
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  />
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors min-h-[56px] cursor-pointer">
                    {item.title}
                  </h3>

                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatCurrencyVND(item.price)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105 cursor-pointer"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="w-12 h-12 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Section */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {wishlistItems.length}
                </div>
                <div className="text-gray-600 font-medium">
                  Total Products in Wishlist
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {formatCurrencyVND(totalValue)}
                </div>
                <div className="text-gray-600 font-medium">Total Amount</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={clearWishlist}
        title="Confirm action"
        description="Are you sure you want to clear all products in your wishlist?"
      />
    </div>
  );
};

export default WishList;

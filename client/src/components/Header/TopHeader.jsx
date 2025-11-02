import { useAuthStore } from "@/lib/zustand/useAuthStore";
import path from "@/ultils/path";
import React, { memo, useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDialog from "../Dialog/ConfirmDialog"; // hoặc CustomDialog, tuỳ bạn

const TopHeader = () => {
  const { user, isAuthenticated, logout, isLoading, checkAuth, message } =
    useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  // 🔔 Khi token hết hạn hoặc có message
  useEffect(() => {
    if (message) {
      setIsLoginModalOpen(true); // mở dialog
    }
  }, [message]);

  // ✅ Hàm xác nhận khi người dùng bấm "Go to Login"
  const handleConfirmLoginModal = () => {
    setIsLoginModalOpen(false);
    navigate(`/${path.LOGIN}`);
  };

  return (
    <div className="w-full h-[60px] bg-gradient-to-r from-[#e63946] via-[#f77f00] to-[#fcbf49] text-white shadow-md flex justify-center items-center">
      <div className="w-main flex items-center justify-between text-sm md:text-base font-medium">
        {/* LEFT: Hotline */}
        <span className="flex items-center gap-2">
          <span className="hidden sm:inline">📞</span>
          ORDER ONLINE OR CALL US{" "}
          <span className="font-semibold">(+1800) 000 8808</span>
        </span>

        {/* RIGHT: User Section */}
        {isLoading ? (
          <div className="flex items-center gap-2 border-l border-white/30 pl-4">
            <span className="flex items-center gap-2 animate-pulse">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Processing...</span>
            </span>
          </div>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-4 border-l border-white/30 pl-4">
            <span className="hidden sm:block">
              Welcome,&nbsp;
              <span className="font-semibold capitalize text-gray-100">
                {user?.lastname} {user?.firstname}
              </span>
            </span>

            <button
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md transition-all duration-200 cursor-pointer"
              title="Logout"
            >
              <AiOutlineLogout size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <Link
            to={`/${path.LOGIN}`}
            className="flex items-center gap-1 border-l border-white/30 pl-4 hover:text-gray-100 hover:underline transition-all duration-200"
          >
            <span>🔐</span>
            <span>Sign In or Create Account</span>
          </Link>
        )}
      </div>

      {/* 🧩 CustomDialog thay Swal */}
      <ConfirmDialog
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Session Expired"
        confirmText="Go to Login"
        cancelText="Not now"
        onConfirm={handleConfirmLoginModal}
        onClose={() => setIsLoginModalOpen(false)}
        description={
          <p className="text-gray-700 text-md">
            Your session has expired. Please login again to continue.
          </p>
        }
      ></ConfirmDialog>
    </div>
  );
};

export default memo(TopHeader);

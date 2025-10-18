import { useAuthStore } from "@/lib/zustand/useAuthStore";
import path from "@/ultils/path";
import React, { memo } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";

const TopHeader = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuthStore();

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
          // 🔵 Loading State
          <div className="flex items-center gap-2 border-l border-white/30 pl-4">
            <span className="flex items-center gap-2 animate-pulse">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Processing...</span>
            </span>
          </div>
        ) : isAuthenticated ? (
          // 🟢 Logged In
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
          // 🔴 Guest
          <Link
            to={`/${path.LOGIN}`}
            className="flex items-center gap-1 border-l border-white/30 pl-4 hover:text-gray-100 hover:underline transition-all duration-200"
          >
            <span>🔐</span>
            <span>Sign In or Create Account</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default memo(TopHeader);

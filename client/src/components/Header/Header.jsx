import React, { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { RiPhoneFill } from "react-icons/ri";
import { MdEmail, MdDashboard } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import path from "@/ultils/path";
import { Cart } from "../Cart/Cart";

const Header = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [isSticky, setIsSticky] = useState(false);

  // 🧠 Theo dõi khi người dùng cuộn để bật/tắt sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full z-50 transition-all duration-300 py-3 bg-white ${
        isSticky ? " shadow-md  fixed top-0 left-0" : " py-5"
      }`}
    >
      <div className="max-w-[1250px] mx-auto flex justify-between items-center px-4 transition-all duration-300">
        {/* Logo */}
        <Link to={"/"}>
          <img
            src={logo}
            alt="Logo"
            className={`object-contain transition-all duration-300 ${
              isSticky ? "w-[150px]" : "w-[180px]"
            }`}
          />
        </Link>

        {/* Contact + Profile + Admin */}
        <div className="flex text-[13px] items-center">
          {/* Phone */}
          <div className="flex flex-col px-6 border-r items-center">
            <span className="flex gap-2 items-center">
              <RiPhoneFill color="red" />
              <span className="font-semibold">(+1800) 000 8808</span>
            </span>
            <span>Mon-Sat 9:00AM - 8:00PM</span>
          </div>

          {/* Email */}
          <div className="flex flex-col px-6 border-r items-center">
            <span className="flex gap-2 items-center">
              <MdEmail color="red" />
              <span className="font-semibold">support@tadathemes.com</span>
            </span>
            <span>Online Support 24/7</span>
          </div>

          {/* User Info */}
          {isAuthenticated && (
            <div className="flex">
              {/* Cart */}
              <div className="cursor-pointer flex px-6 border-r items-center justify-center gap-2">
                <Cart />
              </div>

              {/* Profile */}
              <Link
                to={`/${path.MEMBER}/${path.PERSONAL}`}
                className="cursor-pointer flex px-6 items-center justify-center gap-4 border-r"
              >
                {user?.avatar?.image_url ? (
                  <div className="flex items-center justify-center gap-2">
                    <img
                      src={user.avatar.image_url}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    Profile
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <FaUserCircle size={22} /> Profile
                  </div>
                )}
              </Link>
            </div>
          )}

          {/* Admin Dashboard */}
          {user?.role === "admin" && (
            <Link to={`/${path.ADMIN}`}>
              <div className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md ml-5">
                <MdDashboard size={22} className="text-main" />
                <span className="text-sm font-medium text-main tracking-wide">
                  Admin Workspace
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

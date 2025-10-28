import React from "react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { RiPhoneFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import path from "@/ultils/path";
import { Cart } from "../Cart/Cart";

const Header = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="w-full bg-white shadow-sm z-10">
      <div className="max-w-[1250px] mx-auto flex justify-between items-center h-[110px] py-[35px] px-4">
        <Link to={"/"}>
          <img src={logo} alt="Logo" className="w-[180px] object-contain" />
        </Link>

        <div className="flex text-[13px]">
          <div className="flex flex-col px-6 border-r items-center">
            <span className="flex gap-2 items-center">
              <RiPhoneFill color="red" />
              <span className="font-semibold">(+1800) 000 8808</span>
            </span>
            <span>Mon-Sat 9:00AM - 8:00PM</span>
          </div>
          <div className="flex flex-col px-6 border-r items-center">
            <span className="flex gap-2 items-center">
              <MdEmail color="red" />
              <span className="font-semibold">support@tadathemes.com</span>
            </span>
            <span>Online Support 24/7</span>
          </div>
          {isAuthenticated && (
            <div className="flex">
              <div className="cursor-pointer flex px-6 border-r items-center justify-center gap-2">
                <Cart />
              </div>
              <Link
                to={`/${path.MEMBER}/${path.PERSONAL}`}
                className="cursor-pointer flex px-6 items-center justify-center gap-4 border-r"
              >
                {user?.avatar?.image_url ? (
                  <div className="flex items-center justify-center gap-2">
                    <img
                      src={user.avatar.image_url}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover" // Style cho avatar
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
          )}{" "}
          {user?.role === "admin" && (
            <Link to={`/${path.ADMIN}`}>
              <div className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md hover:opacity-70 transition-all duration-300 shadow-sm hover:shadow-md ml-5">
                <MdDashboard size={22} className="text-main" />
                <span className="text-sm font-medium  text-main tracking-wide">
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

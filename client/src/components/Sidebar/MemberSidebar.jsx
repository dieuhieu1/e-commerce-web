import path from "@/ultils/path";
import React, { memo, useState } from "react";
import default_avatar from "../../assets/default_3.png";
import { memberSidebar } from "@/ultils/constants";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { Link, NavLink } from "react-router-dom";
import { AiOutlineCaretDown, AiOutlineCaretLeft } from "react-icons/ai";
import logo from "../../assets/logo.png";

const MemberSidebar = () => {
  const { user } = useAuthStore();
  const [actived, setActived] = useState([]);

  const handleShowTabs = (tabId) => {
    setActived((prev) =>
      prev.includes(tabId)
        ? prev.filter((id) => id !== tabId)
        : [...prev, tabId]
    );
  };

  const activeStyle =
    "bg-gradient-to-r from-[#ee3131] to-[#ff6b6b] text-white shadow-md";
  const notActiveStyle =
    "text-gray-700 hover:text-[#ee3131] hover:bg-gray-100 transition-all duration-200";

  return (
    <div className="bg-white border-r border-gray-200 w-[260px] h-full flex flex-col shadow-sm">
      {/* Logo */}
      <div className="flex flex-col items-center justify-center py-6 border-b border-gray-200">
        <Link to={`/${path.HOME}`}>
          <img
            src={logo}
            alt="logo"
            className="w-[140px] object-contain drop-shadow-sm"
          />
        </Link>
        <small className="text-gray-500 mt-1 tracking-wide">
          Admin Workspace
        </small>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center justify-center py-6 border-b border-gray-200">
        <div>
          <img
            src={user?.avatar?.image_url || default_avatar}
            alt="logo"
            className="w-[200px] h-[200px] object-cover drop-shadow-sm rounded-full"
          />
        </div>
        <h1 className="text-gray-500 mt-1 tracking-wide">
          {user?.firstname + " " + user?.lastname}
        </h1>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        {memberSidebar.map((el, index) => {
          const Icon = el.icon;
          return (
            <div key={`${el.id}-${index}`} className="mb-1">
              {/* SINGLE ITEM */}
              {el.type === "single" && (
                <NavLink
                  to={el.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer font-medium ${
                      isActive ? activeStyle : notActiveStyle
                    }`
                  }
                >
                  <Icon size={22} />
                  <span>{el.text}</span>
                </NavLink>
              )}

              {/* PARENT ITEM */}
              {el.type === "parent" && (
                <div
                  className="flex flex-col select-none"
                  onClick={() => handleShowTabs(el.id)}
                >
                  <div
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer font-medium hover:bg-gray-100 transition-all duration-200 ${
                      actived.includes(el.id)
                        ? "bg-gray-100 text-[#ee3131]"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={22} />
                      <span>{el.text}</span>
                    </div>
                    {actived.includes(el.id) ? (
                      <AiOutlineCaretDown size={18} />
                    ) : (
                      <AiOutlineCaretLeft size={18} />
                    )}
                  </div>

                  {/* Submenu */}
                  <div
                    className={`flex flex-col ml-4 border-l border-gray-200 overflow-hidden transition-all duration-300 ${
                      actived.includes(el.id)
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {el.submenu?.map((item, subIndex) => (
                      <NavLink
                        to={item.path}
                        key={`${item.id}-${subIndex}`}
                        onClick={(e) => e.stopPropagation()}
                        className={({ isActive }) =>
                          `px-4 py-2 text-sm rounded-lg mt-1 ml-5 cursor-pointer flex items-center gap-2 ${
                            isActive
                              ? "text-[#ee3131] bg-red-50 font-medium"
                              : "text-gray-600 hover:text-[#ee3131] hover:bg-gray-50"
                          }`
                        }
                      >
                        {item.text}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(MemberSidebar);

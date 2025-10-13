import { createSlug } from "@/ultils/helpers";
import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { categories, isLoading } = useSelector((state) => state.app);

  return (
    <div className="flex flex-col border">
      {categories?.map((el) => (
        <NavLink
          key={createSlug(el.title)}
          to={createSlug(el.title)}
          className={`px-5 pt-[15px] pb-[14px] text-sm hover:text-main ${(
            isActive
          ) => (isActive ? "bg-main text-white" : "")}`}
        >
          {el.title}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;

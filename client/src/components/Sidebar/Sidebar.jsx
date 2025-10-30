import { createSlug } from "@/ultils/helpers";
import React from "react";
import { BsFillLaptopFill, BsFillSpeakerFill } from "react-icons/bs";
import { FaCamera, FaListAlt } from "react-icons/fa";
import { MdWatch } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { ImTablet } from "react-icons/im";
import { GiSmartphone } from "react-icons/gi";
import { PiTelevisionSimpleFill } from "react-icons/pi";
import { BiSolidPrinter } from "react-icons/bi";
import { useProductStore } from "@/lib/zustand/useProductStore";

const icons = {
  Camera: <FaCamera />,
  Laptop: <BsFillLaptopFill />,
  Accessories: <MdWatch />,
  Tablet: <ImTablet />,
  Speaker: <BsFillSpeakerFill />,
  Smartphone: <GiSmartphone />,
  Television: <PiTelevisionSimpleFill />,
  Printer: <BiSolidPrinter />,
};

const Sidebar = () => {
  const { productCategories } = useProductStore();

  return (
    // 1. Ẩn trên di động (hidden) và hiển thị từ breakpoint lg (lg:flex)
    // 2. Chỉ áp dụng chiều cao cố định trên lg
    <div className="hidden lg:flex flex-col border border-stone-400 lg:h-[537px]  ">
      <div className="bg-red-700 text-white uppercase flex items-center px-5 py-3 gap-6">
        <span className="text-2xl">
          <FaListAlt />
        </span>
        all collections
      </div>
      <div className="flex justify-center flex-col gap-2">
        {productCategories?.map((el) => (
          <NavLink
            key={el._id}
            to={createSlug(el.title)}
            // 3. SỬA LỖI: className phải là một hàm
            className={({ isActive }) =>
              `px-5 pt-[15px] pb-[14px] text-sm hover:text-main ${
                isActive ? "bg-main text-white" : ""
              }`
            }
          >
            <div className=" flex gap-6 items-center">
              <span className="text-2xl">{icons[el.title]}</span>
              {el.title}
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

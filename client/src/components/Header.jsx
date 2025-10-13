import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { RiPhoneFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { BsHandbagFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
const Header = () => {
  return (
    <div className=" w-main flex justify-between h-[110px] py-[35px]">
      <Link to={"/"}>
        <img src={logo} alt="Logo" className="w-[234px] object-contain" />
      </Link>
      <div className="flex text-[13px] ">
        <div className="flex flex-col px-6 border-r items-center">
          <span className="flex gap-3 items-center">
            <RiPhoneFill color="red" />
            <span className="font-semibold">(+1800) 000 8808</span>
          </span>
          <span>Mon-Sat 9:00AM - 8:00PM</span>
        </div>
        <div className="flex flex-col px-6 border-r items-center">
          <span className="flex gap-3 items-center">
            <MdEmail color="red" />
            <span className="font-semibold"> support@tadathemes.com</span>
          </span>
          <span>Online Support 24/7</span>
        </div>
        <div className="flex px-6 border-r items-center justify-center gap-2">
          <BsHandbagFill color="red" size={24} />
          <span>0 item(s)</span>
        </div>
        <div className="flex px-6 items-center justify-center">
          <FaUserCircle size={24} />
        </div>
      </div>
    </div>
  );
};

export default Header;

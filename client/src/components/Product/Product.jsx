import { formatMoney } from "@/ultils/helpers";
import React, { useState } from "react";
import StarRating from "../StarRating";
import SelectOption from "../SelectOption";
import { AiFillEye } from "react-icons/ai";
import { IoMenu } from "react-icons/io5";
import { BsFillSuitHeartFill } from "react-icons/bs";
import { Link } from "react-router-dom";
const Product = ({ productData, isNew, normal }) => {
  const { thumb, slug, title, price, totalRatings } = productData;

  const [isShowOption, setIsShowOption] = useState(false);

  // Chi-tiet-san-pham
  return (
    <Link
      className="w-full text-base"
      onMouseEnter={(e) => {
        e.stopPropagation();
        setIsShowOption(true);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setIsShowOption(false);
      }}
      to={`/${productData?.category?.toLowerCase()}/${productData?._id}/${
        productData?.title
      }`}
    >
      <div
        className=" relative w-full border border-stone-200 p-[15px] flex flex-col items-center rounded-md overflow-hidden bg-white 
             transition-transform duration-300 ease-in-out 
             hover:scale-110 hover:shadow-lg cursor-pointer "
      >
        <div className="relative w-full">
          <div
            className={`absolute bottom-0 left-0 right-0  flex justify-center gap-2 ${
              isShowOption ? "animate-slide-top" : "animate-slide-bottom"
            } `}
          >
            <SelectOption icon={<BsFillSuitHeartFill />} />
            <SelectOption icon={<IoMenu />} />
            <SelectOption icon={<AiFillEye />} />
          </div>
          <img
            src={
              thumb ||
              "https://www.allaboardeducators.com/images/productimages/1.jpg"
            }
            alt={slug}
            className="w-[274px] h-[274px] object-cover"
          />
          {/* Nhãn NEW ở góc phải */}
          {!normal && (
            <span
              className={`absolute top-[-5px] right-0  text-white text-[12px] font-semibold w-30 py-2 rounded-tr-md rounded-bl-md shadow flex justify-center float-left ${
                isNew ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              {isNew ? "NEW" : "TRENDING"}
            </span>
          )}
        </div>
        <div className="flex flex-col mt-[15px] items-start w-full">
          <span className="line-clamp-1">{title}</span>
          <StarRating rating={totalRatings} />
          <span>{formatMoney(price)} VND </span>
        </div>
      </div>
    </Link>
  );
};

export default Product;

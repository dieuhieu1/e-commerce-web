import React from "react";
import { formatMoney } from "@/ultils/helpers";
import StarRating from "../StarRating";

const ProductCard = ({ productData }) => {
  const { title, thumb, totalRatings, price } = productData;
  return (
    <div className="w-1/3 flex-auto  px-[10px]">
      <div className="flex w-full border mb-[20px]">
        <img
          src={thumb}
          alt="featured_product.jpg"
          className="w-[90px] object-contain p-4"
        />
        <div className="flex flex-col mt-[15px] items-start gap-1 w-full">
          <span className="line-champ-1 capitalize text-sm">
            {title?.toLowerCase()}
          </span>
          <span className="flex h-4">
            <StarRating rating={totalRatings} />
          </span>
          <span>{formatMoney(price)} VND</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import React from "react";
import default_1 from "../../assets/default_1.png";
import moment from "moment";
import StarRating from "../StarRating";

const Review = ({
  image = default_1,
  name = "Anonymous",
  comment,
  updatedAt,
  star,
}) => {
  return (
    <div className="group relative flex gap-4 bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-5 shadow-sm  ">
      {/* Avatar */}
      <div className="flex-none">
        <img
          src={image}
          alt="avatar"
          className="rounded-full object-cover w-[60px] h-[60px] border-2 border-white shadow-md  transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900 text-[16px] leading-none">
              {name}
            </h2>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-gray-500 text-xs italic">
              {moment(updatedAt)?.fromNow()}
            </span>
          </div>
          <div className="flex gap-1">
            <StarRating rating={star} size={18} />
          </div>
        </div>

        {/* Comment Box */}
        <div className="mt-3 bg-white/70 border border-gray-100 rounded-xl px-4 py-3 shadow-inner  transition-all duration-200">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-800">Comment:</span>{" "}
            <span className="italic">{comment}</span>
          </p>
        </div>
      </div>

      {/* Decorative line on hover */}
    </div>
  );
};

export default Review;

import React, { useEffect, useRef } from "react";
import { AiFillStar } from "react-icons/ai";

const VoteBar = ({ number = 0, ratingCounts = 0, ratingTotal = 0 }) => {
  const percentRef = useRef();
  useEffect(() => {
    const percent = Math.round((ratingCounts * 100) / ratingTotal) || 0;

    percentRef.current.style.cssText = `right: ${100 - percent}%`;
  }, [ratingCounts, ratingTotal]);
  return (
    <div className="flex items-center gap-2">
      <div className="flex w-[10%] items-center justify-center gap-2 text-sm ">
        <span>{number} </span>
        <AiFillStar color="orange" />
      </div>
      <div className="w-[75%]">
        <div className="w-full h-[5px] relative bg-gray-200 rounded-full ">
          <div
            ref={percentRef}
            className="absolute inset-0 bg-red-500 right-8 rounded-full"
          ></div>
        </div>
      </div>
      <div className="w-[15%]  flex-2 flex justify-end text-xs text-400">{`${
        ratingCounts || 0
      } reviewers `}</div>
    </div>
  );
};

export default VoteBar;

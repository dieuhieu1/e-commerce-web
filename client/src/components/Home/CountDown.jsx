import React from "react";

const CountDown = ({ unit, number }) => {
  return (
    <div className="w-1/3 h-[60px] flex justify-center items-center rounded-sm  bg-[#F4F4F4] flex-col">
      <span className="text-[18px] text-gray-800">{number}</span>
      <span className="text-xs text-gray-700">{unit}</span>
    </div>
  );
};

export default CountDown;

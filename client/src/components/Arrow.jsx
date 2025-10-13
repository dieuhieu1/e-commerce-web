import React from "react";

const Arrow = ({ icon, onClick, position = "right" }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 transform -translate-y-1/2 z-10 
        bg-gray-300 text-red-500 w-12 h-12 flex items-center justify-center 
        rounded-full hover:bg-gray-400 transition-colors cursor-pointer
        ${position === "right" ? "right-0" : "left-0"}`}
    >
      {icon}
    </button>
  );
};

export default Arrow;

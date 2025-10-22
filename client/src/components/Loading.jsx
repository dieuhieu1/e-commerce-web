import React, { memo } from "react";
import { HashLoader } from "react-spinners";
import { cn } from "@/lib/utils"; // Giả định bạn dùng shadcn

const Loading = ({ text = "Loading...", fullscreen = true, className }) => {
  return (
    <div
      className={cn(
        fullscreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in-0"
          : "absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in-0",
        className
      )}
    >
      <HashLoader color="#facc15" size={60} />
      <p className="mt-4 text-sm text-white animate-pulse">{text}</p>
    </div>
  );
};

export default memo(Loading);

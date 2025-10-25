import React, { memo } from "react";

// Icon Spinner cho trạng thái loading
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  className = "", // Cho phép truyền thêm class từ bên ngoài
}) => {
  const baseStyles =
    "inline-flex items-center justify-center cursor-pointer font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300";

  const variantStyles = {
    primary: "bg-main text-white hover:bg-red-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "bg-transparent border border-slate-400 text-slate-700 hover:bg-slate-100 focus:ring-slate-300",
  };

  const sizeStyles = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-5 text-base",
    lg: "py-3 px-6 text-lg",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed";

  // --- Kết hợp các class ---

  const buttonClasses = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? "w-full" : "w-fit",
    disabled || isLoading ? disabledStyles : "",
    className,
  ].join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {LeftIcon && <LeftIcon className="mr-2 -ml-1 h-5 w-5" />}
          {children}
          {RightIcon && <RightIcon className="ml-2 -mr-1 h-5 w-5" />}
        </>
      )}
    </button>
  );
};

export default memo(Button);

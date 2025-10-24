import React, { memo } from "react";
import { MdErrorOutline } from "react-icons/md";

const InputField = ({
  type = "text",
  name,
  value,
  setValue,
  invalidField,
  setInvalidField,
  label,
  fullWidth = false,
  width,
  onChange,
}) => {
  const error = invalidField?.find((field) => field.name === name);

  return (
    <div className={`relative flex flex-col ${fullWidth ? "w-full" : width}`}>
      {/* Input + Label */}
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onFocus={() => setInvalidField && setInvalidField([])}
          onChange={
            onChange ||
            ((e) => setValue((prev) => ({ ...prev, [name]: e.target.value })))
          }
          className={`
            block
            w-full
            px-2.5 pb-2.5 pt-4
            text-sm text-gray-900
            bg-transparent
            rounded-md
            border
            appearance-none
            focus:outline-none
            focus:ring-1
            peer
            transition-all
            duration-200
            ${
              error
                ? " focus:ring-red-300"
                : "border-gray-300 focus:border-blue-600 focus:ring-blue-200"
            }
          `}
          placeholder=" " // Placeholder phải có nhưng để trống
        />
        <label
          htmlFor={name}
          className={`
            absolute
            text-md font-main
            duration-300 transform
            -translate-y-4 scale-75 top-2 z-10
            origin-[0]
            bg-white
            px-2
            left-1
            peer-placeholder-shown:scale-100
            peer-placeholder-shown:-translate-y-1/2
            peer-placeholder-shown:top-1/2
            peer-focus:top-2
            peer-focus:scale-75
            peer-focus:-translate-y-4
            ${
              error
                ? " peer-focus:text-red-600"
                : "text-gray-500 peer-focus:text-blue-600"
            }
          `}
        >
          {label}
        </label>
      </div>

      {/* Hiển thị lỗi ngay dưới input */}
      {error && (
        <div className="flex items-center gap-1 mt-1 text-red-500 animate-fade-in">
          <MdErrorOutline className="text-lg" />
          <small className="text-[14px] italic font-medium">
            {error.message}
          </small>
        </div>
      )}
    </div>
  );
};

export default memo(InputField);

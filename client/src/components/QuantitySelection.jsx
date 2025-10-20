import React, { useState, useEffect, memo } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";

/**
 * Component QuantitySelector
 * @param {object} props
 * @param {number} [props.initialValue=1] - Giá trị số lượng ban đầu.
 * @param {number} [props.min=1] - Số lượng tối thiểu.
 * @param {number} [props.max=99] - Số lượng tối đa.
 * @param {function(number): void} props.onChange - Callback được gọi khi số lượng thay đổi.
 */
function QuantitySelection({ initialValue = 1, min = 1, max = 99, onChange }) {
  const [quantity, setQuantity] = useState(initialValue);

  // Gửi thông báo cho component cha mỗi khi quantity thay đổi
  useEffect(() => {
    if (onChange) {
      onChange(quantity);
    }
  }, [quantity, onChange]);

  const handleDecrease = () => {
    setQuantity((prev) => (prev > min ? prev - 1 : min));
  };

  const handleIncrease = () => {
    setQuantity((prev) => (prev < max ? prev + 1 : max));
  };

  // Xử lý khi người dùng nhập số trực tiếp
  const handleInputChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      value = min; // Nếu nhập chữ thì reset về min
    } else if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    setQuantity(value);
  };

  // Class dùng chung cho 2 nút
  const buttonClasses =
    "flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full transition-colors duration-200 ease-in-out text-gray-600";
  const disabledButtonClasses = "bg-gray-100 text-gray-400 cursor-not-allowed";
  const enabledButtonClasses =
    "bg-white hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200 cursor-pointer";

  return (
    <div className="flex items-center gap-4">
      {/* Nút giảm */}
      <button
        onClick={handleDecrease}
        disabled={quantity <= min}
        className={`${buttonClasses} ${
          quantity <= min ? disabledButtonClasses : enabledButtonClasses
        }`}
        aria-label="Giảm số lượng"
      >
        <BiMinus size={16} />
      </button>

      {/* Ô nhập số lượng */}
      <input
        type="text"
        value={quantity}
        onChange={handleInputChange}
        className="w-16 h-10 text-center text-lg font-bold border-x-0 border-t-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 transition"
      />

      {/* Nút tăng */}
      <button
        onClick={handleIncrease}
        disabled={quantity >= max}
        className={`${buttonClasses} ${
          quantity >= max ? disabledButtonClasses : enabledButtonClasses
        }`}
        aria-label="Tăng số lượng"
      >
        <BiPlus size={16} />
      </button>
    </div>
  );
}

export default memo(QuantitySelection);

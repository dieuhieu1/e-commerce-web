export const createSlug = (string) =>
  string
    .toLowerCase()
    .normalize("NFD") // tách các ký tự có dấu thành ký tự + dấu riêng biệt
    .replace(/[\u0300-\u036f]/g, "") // xóa các dấu thanh, dấu mũ, dấu móc
    .replace(/đ/g, "d") // thay đ -> d
    .replace(/[^a-z0-9\s-]/g, "") // loại bỏ ký tự đặc biệt
    .trim() // xóa khoảng trắng đầu cuối
    .replace(/\s+/g, "-"); // thay khoảng trắng bằng dấu gạch ngang

export const formatMoney = (number) => {
  return Number(number.toFixed(1)).toLocaleString("en-US");
};
export const validate = (payload, setInvalidFields) => {
  let invalids = 0;
  const newInvalids = [];

  for (const [key, value] of Object.entries(payload)) {
    const trimmedValue = value?.trim?.() || "";

    // Kiểm tra rỗng
    if (!trimmedValue) {
      invalids++;
      newInvalids.push({
        name: key,
        message: "This field is required",
      });
      continue;
    }

    // Xử lý theo từng trường cụ thể
    switch (key) {
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedValue)) {
          invalids++;
          newInvalids.push({
            name: key,
            message: "Invalid email format",
          });
        }
        break;
      }

      case "password": {
        if (trimmedValue.length < 6) {
          invalids++;
          newInvalids.push({
            name: key,
            message: "Password must be at least 6 characters",
          });
        }
        // else if (!/[A-Z]/.test(trimmedValue)) {
        //   invalids++;
        //   newInvalids.push({
        //     name: key,
        //     message: "Password must contain at least one uppercase letter",
        //   });
        // } else if (!/[0-9]/.test(trimmedValue)) {
        //   invalids++;
        //   newInvalids.push({
        //     name: key,
        //     message: "Password must contain at least one number",
        //   });
        // }
        break;
      }

      case "confirmPassword": {
        if (trimmedValue !== payload.password) {
          invalids++;
          newInvalids.push({
            name: key,
            message: "Passwords do not match",
          });
        }
        break;
      }

      case "mobile": {
        const phoneRegex = /^[0-9]{9,11}$/;
        if (!phoneRegex.test(trimmedValue)) {
          invalids++;
          newInvalids.push({
            name: key,
            message: "Invalid phone number format",
          });
        }
        break;
      }

      case "firstname":
      case "lastname": {
        if (trimmedValue.length < 2) {
          invalids++;
          newInvalids.push({
            name: key,
            message: "Name must be at least 2 characters long",
          });
        }
        break;
      }

      default:
        break;
    }
  }

  setInvalidFields(newInvalids);
  return invalids;
};

export const generateRange = (start, end) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => start + index);
};
export const formatCurrency = (value) => {
  if (!value) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseCurrency = (value) => {
  return value.replace(/\./g, "");
};

import default_avatar_1 from "../assets/default_1.png";
import default_avatar_2 from "../assets/default_2.png";
import default_avatar_3 from "../assets/default_3.png";

export const getRandomAvatar = () => {
  const defaultAvatars = [default_avatar_1, default_avatar_2, default_avatar_3];
  const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
  return defaultAvatars[randomIndex];
};
export const formatUSD = (amount) => (amount / 24000).toFixed(2);
export const formatCurrencyVND = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

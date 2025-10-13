export const createSlug = (string) =>
  string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\ue0300-\u036f]/g, "")
    .split(" ")
    .join("-");
export const formatMoney = (number) =>
  Number(number.toFixed(1)).toLocaleString("vi-VN");

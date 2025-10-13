import axios from "../lib/axios";

export const apiGetCategories = () =>
  axios({ url: "/products/categories/", method: "get" });

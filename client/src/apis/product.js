import axios from "../lib/axios";

export const apiGetProducts = (params) =>
  axios({ url: "/products", method: "get", params });
export const apiGetProductCategories = () =>
  axios({ url: "/products/categories/", method: "get" });
export const apiGetProductById = (pid) =>
  axios({ url: "/products/" + pid, method: "get" });
export const apiRatingProduct = (pid, data) =>
  axios({ url: "/products/ratings/" + pid, method: "put", data });

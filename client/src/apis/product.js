import axios from "../lib/axios";

export const apiGetProducts = (params) =>
  axios({ url: "/products", method: "get", params });
export const apiGetProductCategories = () =>
  axios({ url: "/products/categories/", method: "get" });
export const apiGetProductById = (pid) =>
  axios({ url: "/products/" + pid, method: "get" });
export const apiRatingProduct = (pid, data) =>
  axios({ url: "/products/ratings/" + pid, method: "put", data });
export const apiCreateProduct = (data) =>
  axios({ url: "/products", method: "post", data });
export const apiUpdateProduct = (pid, data) =>
  axios({ url: "/products/" + pid, method: "put", data });
export const apiDeleteProduct = (pid) =>
  axios({ url: "/products/" + pid, method: "delete" });

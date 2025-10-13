import axios from "../lib/axios";

export const apiGetProducts = (params) =>
  axios({ url: "/products", method: "get", params });

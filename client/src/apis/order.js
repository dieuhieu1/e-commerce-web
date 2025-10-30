import axios from "../lib/axios";

export const apiCreateOrder = (data) =>
  axios({ url: "/order/add", method: "post", data });
export const apiGetOrders = (params) =>
  axios({ url: "/order", method: "get", params });
export const apiGetMyOrders = (params) =>
  axios({ url: "/order/me", method: "get", params });
export const apiCancelOrder = (orderId) =>
  axios({ url: "/order/cancel/" + orderId, method: "put" });

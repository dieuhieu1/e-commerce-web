import axios from "../lib/axios";

export const apiGetUsers = (params) =>
  axios({
    url: "/user",
    method: "get",
    params,
  });
export const apiUpdateUsers = (uid, data) =>
  axios({
    url: "/user/" + uid,
    method: "put",
    data,
  });
export const apiDeleteUsers = (uid) =>
  axios({
    url: "/user/" + uid,
    method: "delete",
  });
export const apiUpdateProfileUser = (data) =>
  axios({
    url: "/user/current",
    method: "put",
    data,
  });
export const apiUpdateUserCart = (pid, data) =>
  axios({
    url: "/user/cart/add/" + pid,
    method: "put",
    data,
  });

export const apiRemoveProductFromCart = (pid, data) =>
  axios({
    url: "/user/cart/remove/" + pid,
    method: "put",
    data,
  });
export const apiUpdateWishlist = (data) =>
  axios({
    url: "/user/wishlist",
    method: "put",
    data,
  });

import axios from "../lib/axios";

export const apiRegister = (userData) =>
  axios({
    url: "/user/register",
    method: "post",
    data: userData,
    withCredentials: true,
  });
export const apiLogin = (credentials) =>
  axios({ url: "/user/login", method: "post", data: credentials });
export const apiLogout = (token) =>
  axios({
    url: "/auth/logout",
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const apiGetCurrentUser = (token) =>
  axios({
    url: "/user/current",
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const apiForgotPassword = (data) =>
  axios({
    url: "/user/forgot-password",
    method: "post",
    data: data,
  });
export const apiResetPassword = (data) =>
  axios({
    url: "/user/reset-password",
    method: "post",
    data: data,
  });
export const apiGetCurrent = () =>
  axios({
    url: "/user/current",
    method: "get",
  });

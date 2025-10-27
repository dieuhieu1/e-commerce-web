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
export const apiUpdateProfileUser = () =>
  axios({
    url: "/user/",
    method: "delete",
  });

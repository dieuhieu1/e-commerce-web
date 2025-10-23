import axios from "../lib/axios";

export const apiGetUsers = (params) =>
  axios({
    url: "/user",
    method: "get",
    params,
  });

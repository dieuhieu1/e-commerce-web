import axios from "../lib/axios";

export const apiGetNotification = () =>
  axios({ url: "/notification", method: "get" });
export const apiMarkAsRead = (nid) =>
  axios({ url: "/notification/" + nid + "/read", method: "patch" });

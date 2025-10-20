import axios from "axios";
import { useAuthStore } from "./zustand/useAuthStore";

// Add a request interceptor
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
});

instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error?.response?.data || error;
  }
);

export default instance;

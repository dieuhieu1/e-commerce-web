import axios from "../lib/axios";

export const apiUploadImages = async (formData) =>
  axios({
    url: "/images/upload-images",
    method: "post",
    data: formData,
  });
export const apiDeleteImage = async (image) =>
  axios({ url: `/images/delete-image`, method: "delete", data: image });

const imageRouter = require("express").Router();
const { uploadCloud } = require("../../config/cloudinary.config");
const {
  uploadImages,
  deleteImage,
  uploadImage,
} = require("../../controllers/file-uploader/imageController");
const { verifyAccessToken, isAdmin } = require("../../middlewares/verifyToken");
imageRouter.post(
  "/upload-images",
  verifyAccessToken,
  uploadCloud.array("fileImages", 10),
  uploadImages
);
imageRouter.post(
  "/upload-image",
  verifyAccessToken,
  uploadCloud.single("fileImage"),
  uploadImage
);
imageRouter.delete("/delete-image", verifyAccessToken, deleteImage);

module.exports = imageRouter;

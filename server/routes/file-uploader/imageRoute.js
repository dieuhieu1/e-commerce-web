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
  isAdmin,
  uploadCloud.array("fileImages", 10),
  uploadImages
);
imageRouter.post(
  "/upload-image",
  verifyAccessToken,
  isAdmin,
  uploadCloud.single("fileImage"),
  uploadImage
);
imageRouter.delete("/:id", verifyAccessToken, isAdmin, deleteImage);

module.exports = imageRouter;

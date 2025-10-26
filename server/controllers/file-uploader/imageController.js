const Image = require("../../models/Image");
const asyncHandler = require("express-async-handler");
const { cloudinary } = require("../../config/cloudinary.config");

const uploadImages = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  if (!req.files || req.files.length === 0)
    throw new Error("Missing inputs! No images uploaded");
  console.log(req.files);

  const imagesData = req.files.map((file) => ({
    image_url: file.path,
    publicId: file.filename,
    uploadedBy: userId,
  }));

  const savedImage = await Image.insertMany(imagesData);
  if (!savedImage) {
    throw new Error(
      "Something went wrong! Cannot insert image to the DB. Please check the error log"
    );
  }
  return res.status(201).json({
    success: true,
    message: "Images uploaded successfully",
    data: savedImage,
  });
});
const uploadImage = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  if (!req.file) {
    throw new Error("Missing file upload! Please check your request params!");
  }
  const { path: image_url, filename: publicId } = req.file;
  const newImage = await Image.create({
    image_url: image_url,
    publicId: publicId,
    uploadedBy: userId,
  });
  if (!newImage) {
    return res.status(500).json({
      success: false,
      message: "Something wrong when uploaded image. Please try again",
    });
  }

  res.status(201).json({
    success: true,
    message: "Image uploaded successfully!",
    result: newImage,
  });
});
const deleteImage = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  const { _id: userId } = req.user;

  if (!_id) {
    throw new Error("Missing image id! Please check your request params");
  }
  const image = await Image.findById(_id);

  if (!image) {
    return res.status(404).json({
      success: false,
      message: "Image not found! Please check your imageId",
    });
  }
  // Destructuring Image property
  const { publicId, uploadedBy } = image;
  // Check the current admin
  const isUploaded = uploadedBy.toString() === userId ? true : false;

  if (!isUploaded) {
    return res.status(403).json({
      success: false,
      message: "You don't have permission to delete this image!",
    });
  }
  // Delete in the Cloudinary
  await cloudinary.uploader.destroy(publicId);

  // Delete image in MongoDB
  const deletedImage = await Image.findByIdAndDelete(_id);
  return res.status(200).json({
    success: deletedImage ? true : false,
    message: deletedImage
      ? "Image Deleted Successfully!"
      : "Something went wrong cannot deleted image in the DB. Please check the error log",
    result: deletedImage,
  });
});

module.exports = {
  uploadImages,
  deleteImage,
  uploadImage,
};

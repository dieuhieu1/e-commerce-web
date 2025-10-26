const { cloudinary } = require("../config/cloudinary.config");

const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) return console.warn("⚠️ No publicId provided for deletion.");

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      console.log("🧹 Deleted image from Cloudinary:", publicId);
    } else {
      console.warn("⚠️ Failed or already deleted:", publicId, result);
    }
  } catch (error) {
    console.error("❌ Error deleting image from Cloudinary:", error.message);
  }
};

module.exports = { deleteImageFromCloudinary };

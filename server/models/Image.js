const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      require: true,
    },

    publicId: {
      type: String,
      require: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);

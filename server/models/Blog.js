const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    numberViews: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    images: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZyUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
    },
    author: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Blog", blogSchema);

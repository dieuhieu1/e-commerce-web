const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true,
    index: true,
  },
});

module.exports = mongoose.model("BlogCategory", blogCategorySchema);

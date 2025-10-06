const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true,
    index: true,
    trim: true,
  },
});

module.exports = mongoose.model("ProductCategory", productCategorySchema);

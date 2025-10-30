const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        color: String,
        price: Number,
        thumb: String,
        title: String,
      },
    ],
    status: {
      type: String,
      default: "Pending",
      enum: ["Cancelled", "Succeed", "Pending", "Processing"],
    },
    total: Number,
    // coupon: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "Coupon",
    // },
    orderedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);

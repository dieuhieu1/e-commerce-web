const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
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
      enum: ["Cancelled", "Succeed", "Pending", "Processing", "Shipping"],
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
    paymentMethod: String,
    shippingAddress: String,
  },
  { timestamps: true }
);
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");

    // Get daily counter
    const today = new Date().setHours(0, 0, 0, 0);
    const count = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    const seq = String(count + 1).padStart(4, "0");
    this.orderId = `ORD-${dateStr}-${seq}`;
  }
  next();
});

orderSchema.index({ orderedBy: 1 });
orderSchema.index({ createdAt: -1 });
//Export the model
module.exports = mongoose.model("Order", orderSchema);

// Ví dụ schema (Mongoose/MongoDB)const mongoose = require("mongoose"); // Erase if already required
const mongoose = require("mongoose"); // Erase if already required

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      require: true,
    },
    message: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Notification", notificationSchema);

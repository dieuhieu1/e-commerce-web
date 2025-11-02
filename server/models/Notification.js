// Ví dụ schema (Mongoose/MongoDB)const mongoose = require("mongoose"); // Erase if already required
const mongoose = require("mongoose"); // Erase if already required
// Declare the Schema of the Mongo model
// Ví dụ schema (Mongoose/MongoDB)
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  message: String, // "Đơn hàng #123 vừa được đặt."
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

//Export the model
module.exports = mongoose.model("Notification", notificationSchema);

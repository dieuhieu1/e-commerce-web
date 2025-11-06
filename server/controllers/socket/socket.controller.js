const Notification = require("../../models/Notification");
const User = require("../../models/User");
const asyncHandler = require("express-async-handler");

const userSockets = new Map();

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
    socket.on("user_connected", async (userId) => {
      if (userId) {
        userSockets.set(userId, socket.id);
      }
      socket.join(`user-${userId}`);

      const user = await User.findById({ _id: userId });
      if (user && user.role === "admin") {
        socket.join("admin_room", () => {});
      }
    });

    socket.on("disconnected", (userId) => {
      console.log("User Disconnected:", socket.id);

      userSockets.delete(userId);
    });
  });
};

const sendNotificationToAdmin = asyncHandler(async (io, notificationData) => {
  const admins = await User.find({ role: "admin" }).select("_id");

  const createNotificationPromises = admins.map((admin) => {
    return new Notification({
      userId: admin._id,
      orderId: notificationData.orderId,
      message: notificationData.message,
      read: false,
    }).save();
  });
  const savedNotifcations = await Promise.all(createNotificationPromises);

  io.to("admin_room").emit("new_notification", {
    orderId: notificationData.orderId,
    message: notificationData.message,
    createdAt: Date.now(),
  });

  return savedNotifcations;
});

const sendNotificationToUser = asyncHandler(
  async (io, userId, notificationData) => {
    // Create new notification in DB
    const newNotifcation = await Notification.create({
      userId: userId,
      orderId: notificationData.orderId,
      message: notificationData.message,
      read: false,
    });
    // Emit Real-time data to FE
    io.to(`user_${userId}`).emit("new_notification", {
      orderId: notificationData.orderId,
      message: notificationData.message,
      status: notificationData.status,
      createdAt: newNotifcation.createdAt,
    });

    return newNotifcation;
  }
);

module.exports = {
  sendNotificationToAdmin,
  sendNotificationToUser,
  setupSocket,
};

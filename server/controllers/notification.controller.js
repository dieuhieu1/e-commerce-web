const Notification = require("../models/Notification");
const asyncHandler = require("express-async-handler");

const getAllNotifications = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  const { page = 1, limit = 20 } = req.query;
  // Find notifications base on userId
  const notifications = await Notification.find({
    userId,
  })
    .sort({
      createdAt: -1,
    })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  if (!notifications || notifications.length === 0) {
    return res.status(200).json({
      success: true,
      message: "You don't have any notification right now!",
    });
  }
  const total = notifications.length;
  const unreadNotifications = await Notification.countDocuments({
    userId,
    read: false,
  });

  return res.status(200).json({
    success: true,
    data: {
      totalNotifications: total,
      unreadCount: unreadNotifications,
      notifications,
    },
  });
});

const getUnreadNotifications = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  const notifications = await Notification.find({
    userId,
    read: false,
  })
    .sort({ createdAt: -1 })
    .populate("orderId", "orderNumber totalAmount");

  if (!notifications || notifications.length === 0) {
    return res.status(200).json({
      success: true,
      message: "You don't have any notification right now!",
    });
  }

  return res.status(200).json({
    success: true,
    data: notifications,
    count: notifications.length,
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const { nid: notificationId } = req.params;
  const { _id: userId } = req.user;

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: notification,
  });
});
module.exports = { getAllNotifications, getUnreadNotifications, markAsRead };

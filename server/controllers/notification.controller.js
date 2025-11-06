const Notification = require("../models/Notification");
const asyncHandler = require("express-async-handler");

const getAllNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { page = 1, limit = 20 } = req.query;
  // Find notifications base on userId
  const notifications = await Notification.find({ userId })
    .sort({
      createdAt: -1,
    })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  if (!notifications) {
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
    notifications: {
      totalNotifications: total,
      notifications,
      unread: unreadNotifications,
    },
  });
});

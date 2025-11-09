const notificationRouter = require("express").Router();

const {
  getAllNotifications,
  getUnreadNotifications,
  markAsRead,
} = require("../controllers/notification.controller");
const { verifyAccessToken } = require("../middlewares/verifyToken");

notificationRouter.get("/", verifyAccessToken, getAllNotifications);
notificationRouter.get("/unread", verifyAccessToken, getUnreadNotifications);
notificationRouter.patch("/:nid/read", verifyAccessToken, markAsRead);

module.exports = notificationRouter;

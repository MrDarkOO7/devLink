const express = require("express");
const { userAuth } = require("../middleware/auth");
const notificationService = require("../utils/notify");
const Notification = require("../models/notification.model");

const notificationRouter = express.Router();

// get all notifications
notificationRouter.get("/", userAuth, async (req, res) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({
    message: "Notifications fetched successfully",
    data: notifications,
  });
});

// get unread notification count
notificationRouter.get("/unread-count", userAuth, async (req, res) => {
  const userId = req.user._id;

  const unreadCount = await Notification.countDocuments({
    userId,
    isRead: false,
  });

  res.json({
    message: "Unread notification count fetched successfully",
    data: { unreadCount },
  });
});

// mark notification as read
notificationRouter.patch("/mark-read", userAuth, async (req, res) => {
  const userId = req.user._id;

  await Notification.updateMany({ userId, isRead: false }, { isRead: true });

  res.json({
    message: "All notifications marked as read",
  });
});

module.exports = notificationRouter;

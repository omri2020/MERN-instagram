const Notification = require("../models/notificationModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.addNotification = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  const notification = await Notification.findOne({ user: userId });
  if (!notification) {
    const newNotification = await Notification.create({
      user: userId,
      chatNotifications: [{ chat: chatId, unreadCount: 1 }],
    });

    return res.status(200).json({
      status: "success",
      notification: newNotification,
    });
  }

  const chatNotification = notification.chatNotifications.find(
    (chatNotification) => chatNotification.chat.toString() === chatId,
  );
  if (!chatNotification) {
    notification.chatNotifications.push({ chat: chatId, unreadCount: 1 });
  } else {
    chatNotification.unreadCount += 1;
  }
  await notification.save();

  res.status(200).json({
    status: "success",
    notification: notification,
  });
});

exports.removeNotification = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  const notification = await Notification.findOne({ user: userId });
  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  const chatNotification = notification.chatNotifications.find(
    (chatNotification) => chatNotification.chat.toString() === chatId,
  );
  if (!chatNotification) {
    return next(new AppError("Chat notification not found", 404));
  }

  chatNotification.unreadCount = 0;
  await notification.save();

  res.status(200).json({
    status: "success",
    notification: notification,
  });
});

exports.getAllNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const notification = await Notification.findOne({ user: userId });
  if (!notification) {
    return res.status(200).json({
      status: "success",
      notification: {
        user: userId,
        chatNotifications: [],
      },
    });
  }

  res.status(200).json({
    status: "success",
    notification: notification,
  });
});

const express = require("express");
const router = express.Router({ mergeParams: true });
const authController = require("../controllers/authController");
const notificationController = require("../controllers/notificationController");

// POST /api/v1/chats/:chatId/notification
router.post(
  "/",
  authController.protect,
  notificationController.addNotification,
);

// PATCH /api/v1/chats/:chatId/notification
router.patch(
  "/",
  authController.protect,
  notificationController.removeNotification,
);

// GET /api/v1/users/:userId/notifications
router.get(
  "/",
  authController.protect,
  notificationController.getAllNotifications,
);

module.exports = router;

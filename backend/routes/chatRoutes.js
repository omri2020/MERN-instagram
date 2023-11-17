const express = require("express");
const authController = require("../controllers/authController");
const chatController = require("../controllers/chatController");
const notificationRoutes = require("./notificationRoutes");

const router = express.Router();

router.use("/:chatId/notifications", notificationRoutes);

// Create a chat
router.route("/").post(authController.protect, chatController.getOrCreateChat);

// CRUD operations
router.route("/:chatId").get(authController.protect, chatController.getChat);

// read all participants messages from a chat
router.patch(
  "/:chatId/read",
  authController.protect,
  chatController.readAllMessages,
);

// Send a message to a chat
router
  .route("/:chatId/messages")
  .post(authController.protect, chatController.sendMessage)
  .get(authController.protect, chatController.getAllChatMessages);

// read a message
router.patch(
  "/:messageId/read-message",
  authController.protect,
  chatController.readMessage,
);

module.exports = router;

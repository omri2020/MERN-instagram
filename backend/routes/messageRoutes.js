const express = require("express");
const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");

const router = express.Router();

// router
//   .route("/:chatId/messages")
//   .post(authController.protect, messageController.sendMessage)
//   .get(authController.protect, messageController.getAllChatMessages);

// router.patch(
//   "/:messageId/read-message",
//   authController.protect,
//   messageController.readMessage,
// );

module.exports = router;

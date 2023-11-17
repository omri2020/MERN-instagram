// const Message = require("../models/messageModel");
// const Chat = require("../models/chatModel");
// const Notification = require("../models/notificationModel");
// const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");

// exports.getAllChatMessages = catchAsync(async (req, res, next) => {
//   const { chatId } = req.params;
//   const { page, limit } = req.query;

//   const chat = await Chat.findById(chatId);
//   if (!chat) {
//     return next(new AppError("Chat not found", 404));
//   }

//   const messages = await Message.find({ chat: chatId })
//     .sort({ createdAt: 1 })
//     .skip((page - 1) * limit)
//     .limit(limit * 1)
//     .populate({ path: "sender", select: "name" });

//   res.status(200).json({
//     status: "success",
//     messages: messages,
//     chat: chatId,
//   });
// });

// exports.sendMessage = catchAsync(async (req, res, next) => {
//   const { chatId } = req.params;
//   const senderId = req.user._id;
//   const { messageContent } = req.body;

//   const chat = await Chat.findById(chatId);
//   if (!chat) {
//     return next(new AppError("Chat not found", 404));
//   }

//   if (!chat.participants.includes(senderId)) {
//     return next(new AppError("You are not a participant of this chat", 403));
//   }

//   const message = new Message({
//     message: messageContent,
//     sender: senderId,
//     chat: chatId,
//     readBy: [senderId],
//   });

//   await message.save();
//   await message.populate({ path: "sender", select: "name" });

//   // Update the last message in the chat
//   chat.latestMessage = message._id;
//   await chat.save();

//   const socketMap = req.app.get("socketMap");
//   const participantSockets = chat.participants
//     .filter((participant) => participant.toString() !== senderId.toString()) // Exclude the sender
//     .map((participant) => socketMap[participant.toString()]) // Map participant IDs to their sockets
//     .filter((socket) => socket); // Filter out undefined sockets

//   participantSockets.forEach((socket) => {
//     socket.emit("message", message); // Emit message to each participant's socket
//   });

//   for (const participant of chat.participants) {
//     if (participant.toString() !== senderId.toString()) {
//       try {
//         await Notification.findOneAndUpdate(
//           { user: participant, "chatNotifications.chat": chatId },
//           { $inc: { "chatNotifications.$.unreadCount": 1 } },
//           { upsert: true, new: true },
//         );
//       } catch (error) {
//         console.error(error);
//         // handle error appropriately
//       }
//     }
//   }

//   // Send message to all participants except the sender
//   res.status(201).json({
//     status: "success",
//     message: message,
//   });
// });

// exports.readMessage = catchAsync(async (req, res, next) => {
//   const messageId = req.params.messageId;
//   const userId = req.user._id;

//   const message = await Message.findById(messageId);
//   if (!message) {
//     return next(new AppError("Message not found", 404));
//   }

//   if (message.sender.toString() === userId.toString()) {
//     return next(new AppError("You cannot mark your own message as read", 403));
//   }

//   if (message.readBy.includes(userId)) {
//     return next(new AppError("Message already read", 403));
//   }

//   message.readBy.push(userId);

//   await message.save();

//   res.status(200).json({
//     status: "success",
//     message: message,
//   });
// });

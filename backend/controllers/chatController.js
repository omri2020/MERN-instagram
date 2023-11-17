// const Chat = require("../models/chatModel");
// const Message = require("../models/messageModel");
// // const Notification = require("../models/notificationModel");
// const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");
// const createOrUpdateNotification = require("../utils/createOrUpdateNotifications");

// exports.getOrCreateChat = catchAsync(async (req, res, next) => {
//   const { participants, chatName, isGroupChat } = req.body;
//   const chat = await Chat.findOne({ participants: { $all: participants } });
//   if (chat) {
//     return res.status(200).json({
//       status: "success",
//       chat: chat,
//     });
//   }
//   const newChat = await Chat.create({
//     participants: participants,
//     chatName: chatName,
//     isGroupChat: isGroupChat,
//   });

//   await newChat.populate({ path: "participants", select: "name photo" });

//   // Emit chat to all participants' sockets
//   const socketMap = req.app.get("socketMap");
//   const participantSockets = participants
//     .map((participant) => socketMap[participant.toString()]) // Map participant IDs to their sockets
//     .filter((socket) => socket); // Filter out undefined sockets

//   participantSockets.forEach((socket) => {
//     socket.emit("newChat", newChat); // Emit chat to each participant's socket
//   });

//   res.status(201).json({
//     status: "success",
//     chat: newChat,
//   });
// });

// exports.getChat = catchAsync(async (req, res, next) => {
//   const { chatId } = req.params;
//   const chat = await Chat.findById(chatId).populate({
//     path: "participants",
//     select: "name photo",
//   });
//   if (!chat) {
//     return next(new AppError("Chat not found", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     chat: chat,
//   });
// });

// exports.readAllMessages = catchAsync(async (req, res, next) => {
//   const chatId = req.params.chatId;
//   const userId = req.user._id;

//   const chat = await Chat.findById(chatId);
//   if (!chat) {
//     return next(new AppError("Chat not found", 404));
//   }
//   const participantIds = chat.participants.map((participant) =>
//     userId.toString() !== participant.toString() ? participant : null,
//   );

//   const messages = await Message.updateMany(
//     { chat: chatId, sender: { $in: participantIds } },
//     { $addToSet: { readBy: userId } },
//   );

//   res.status(200).json({
//     status: "success",
//     messages: messages,
//   });
// });

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
//   const socketMap = req.app.get("socketMap");

//   // Validate chat
//   const chat = await Chat.findById(chatId);
//   if (!chat) {
//     return next(new AppError("Chat not found", 404));
//   }

//   if (!chat.participants.includes(senderId)) {
//     return next(new AppError("You are not a participant of this chat", 403));
//   }

//   // Create the message
//   const message = new Message({
//     message: messageContent,
//     sender: senderId,
//     chat: chatId,
//     readBy: [senderId],
//   });

//   // Update the readBy array and handle notifications
//   const notificationPromises = [];
//   chat.participants.map(async (participant) => {
//     const participantIdString = participant.toString();
//     const participantSocket = socketMap[participantIdString];

//     if (participantIdString !== senderId.toString()) {
//       if (!participantSocket) {
//         // Participant is offline, create a notification
//         notificationPromises.push(
//           createOrUpdateNotification(participant, chatId),
//         );
//       } else if (participantSocket.currentChatId !== chatId) {
//         // Participant is online but not in the chat, handle notification logic
//         notificationPromises.push(
//           createOrUpdateNotification(participant, chatId),
//         );
//         // Emit a notification event to the participant's socket
//         console.log("participantSocket", participantSocket);
//         participantSocket.emit("newNotification", { chatId, messageContent });
//       } else {
//         // Participant is in the chat, add to readBy array
//         message.readBy.push(participant);
//       }
//     }
//   });

//   await Promise.all(notificationPromises);

//   // Save the message after updating readBy array
//   await message.save();
//   await message.populate({ path: "sender", select: "name" });

//   // Emit message to all participants' sockets
//   chat.participants.forEach((participant) => {
//     if (participant.toString() !== senderId.toString()) {
//       const participantSocket = socketMap[participant.toString()];
//       if (participantSocket) {
//         participantSocket.emit("message", message);
//       }
//     }
//   });

//   // Update the last message in the chat
//   chat.latestMessage = message._id;
//   await chat.save();

//   // Respond to the sender
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
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
// const Notification = require("../models/notificationModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const createOrUpdateNotification = require("../utils/createOrUpdateNotifications");

exports.getOrCreateChat = catchAsync(async (req, res, next) => {
  const { participants, chatName, isGroupChat } = req.body;
  const chat = await Chat.findOne({ participants: { $all: participants } });
  if (chat) {
    return res.status(200).json({
      status: "success",
      chat: chat,
    });
  }
  const newChat = await Chat.create({
    participants: participants,
    chatName: chatName,
    isGroupChat: isGroupChat,
  });

  await newChat.populate({ path: "participants", select: "name photo" });

  // Emit chat to all participants' sockets
  const socketMap = req.app.get("socketMap");
  const participantSockets = participants
    .map((participant) => socketMap[participant.toString()]) // Map participant IDs to their sockets
    .filter((socket) => socket); // Filter out undefined sockets

  participantSockets.forEach((socket) => {
    socket.emit("newChat", newChat); // Emit chat to each participant's socket
  });

  res.status(201).json({
    status: "success",
    chat: newChat,
  });
});

exports.getChat = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;
  const chat = await Chat.findById(chatId).populate({
    path: "participants",
    select: "name photo",
  });
  if (!chat) {
    return next(new AppError("Chat not found", 404));
  }
  res.status(200).json({
    status: "success",
    chat: chat,
  });
});

exports.readAllMessages = catchAsync(async (req, res, next) => {
  const chatId = req.params.chatId;
  const userId = req.user._id;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new AppError("Chat not found", 404));
  }
  const participantIds = chat.participants.map((participant) =>
    userId.toString() !== participant.toString() ? participant : null,
  );

  const messages = await Message.updateMany(
    { chat: chatId, sender: { $in: participantIds } },
    { $addToSet: { readBy: userId } },
  );

  res.status(200).json({
    status: "success",
    messages: messages,
  });
});

exports.getAllChatMessages = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;
  const { page, limit } = req.query;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new AppError("Chat not found", 404));
  }

  const messages = await Message.find({ chat: chatId })
    .sort({ createdAt: 1 })
    .skip((page - 1) * limit)
    .limit(limit * 1)
    .populate({ path: "sender", select: "name" });

  res.status(200).json({
    status: "success",
    messages: messages,
    chat: chatId,
  });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
  console.log("chatController: sendMessage called");
  const { chatId } = req.params;
  const senderId = req.user._id;
  const { messageContent } = req.body;
  const socketMap = req.app.get("socketMap");

  // Validate chat
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new AppError("Chat not found", 404));
  }

  if (!chat.participants.includes(senderId)) {
    return next(new AppError("You are not a participant of this chat", 403));
  }

  // Create the message
  const message = new Message({
    message: messageContent,
    sender: senderId,
    chat: chatId,
    readBy: [senderId],
  });

  // Update the readBy array and handle notifications
  const notificationPromises = [];
  console.log("chatController: Preparing notification promises");

  for (const participant of chat.participants) {
    const participantIdString = participant.toString();
    const participantSocket = socketMap[participantIdString];

    if (participantIdString !== senderId.toString()) {
      if (!participantSocket) {
        console.log("chatController: Participant socket not found");
        // Participant is offline, create a notification
        notificationPromises.push(
          createOrUpdateNotification(participant, chatId),
        );
      } else if (participantSocket.currentChatId !== chatId) {
        console.log("chatController: Participant socket not in chat");
        // Participant is online but not in the chat, handle notification logic
        notificationPromises.push(
          createOrUpdateNotification(participant, chatId),
        );
        // Emit a notification event to the participant's socket
        console.log(
          "chatController: Emitting newNotification to participant",
          participantIdString,
        );
        participantSocket.emit("newNotification", { chatId, messageContent });
      } else {
        // Participant is in the chat, add to readBy array
        message.readBy.push(participant);
      }
    }
  }

  console.log("chatController: Awaiting notification promises resolution");
  await Promise.all(notificationPromises);

  // Save the message after updating readBy array
  await message.save();
  await message.populate({ path: "sender", select: "name" });

  // Emit message to all participants' sockets
  chat.participants.forEach((participant) => {
    try {
      const participantIdString = participant.toString();
      if (participant.toString() !== senderId.toString()) {
        const participantSocket = socketMap[participant.toString()];
        if (participantSocket) {
          console.log(
            "chatController: Emitting message to participant",
            participantIdString,
          );
          participantSocket.emit("message", message);
        }
      }
    } catch (err) {
      console.error(
        "chatController: Error emitting message to participant",
        participantIdString,
        err,
      );
    }
  });

  // Update the last message in the chat
  chat.latestMessage = message._id;
  await chat.save();

  // Respond to the sender
  res.status(201).json({
    status: "success",
    message: message,
  });
});

exports.readMessage = catchAsync(async (req, res, next) => {
  const messageId = req.params.messageId;
  const userId = req.user._id;

  const message = await Message.findById(messageId);
  if (!message) {
    return next(new AppError("Message not found", 404));
  }

  if (message.sender.toString() === userId.toString()) {
    return next(new AppError("You cannot mark your own message as read", 403));
  }

  if (message.readBy.includes(userId)) {
    return next(new AppError("Message already read", 403));
  }

  message.readBy.push(userId);

  await message.save();

  res.status(200).json({
    status: "success",
    message: message,
  });
});

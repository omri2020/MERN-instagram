const Notification = require("../models/notificationModel");
const catchAsync = require("./catchAsync");

const createOrUpdateNotification = catchAsync(
  async function (participant, chatId) {
    let notification = await Notification.findOne({
      user: participant,
    });

    if (notification) {
      // Check if the chat notification already exists for the chatId
      const chatNotificationIndex = notification.chatNotifications.findIndex(
        (chatNotif) => chatNotif.chat.toString() === chatId.toString(),
      );

      if (chatNotificationIndex > -1) {
        // Chat notification exists, increment the unread count
        notification.chatNotifications[chatNotificationIndex].unreadCount += 1;
      } else {
        // Chat notification does not exist, add a new one
        notification.chatNotifications.push({ chat: chatId, unreadCount: 1 });
      }

      // Save the updated notification document
      await notification.save();
    } else {
      // Create a new notification
      notification = await Notification.create({
        user: participant,
        chatNotifications: [{ chat: chatId, unreadCount: 1 }],
      });
    }
    return notification;
  },
);

module.exports = createOrUpdateNotification;

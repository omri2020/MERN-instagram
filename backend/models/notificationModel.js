const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    chatNotifications: [
      {
        chat: {
          type: mongoose.Schema.ObjectId,
          ref: "Chat",
        },
        unreadCount: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

notificationSchema.virtual("notifications", function () {
  return this.chatNotifications.reduce((acc, chatNotification) => {
    return acc + chatNotification.unreadCount;
  }, 0);
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;

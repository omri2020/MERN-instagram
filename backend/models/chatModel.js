const mongoose = require("mongoose");
const Message = require("./messageModel");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chatName: {
      type: String,
      default: "",
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

chatSchema.methods.getMessageCount = function () {
  return Message.countDocuments({ chat: this._id });
};

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;

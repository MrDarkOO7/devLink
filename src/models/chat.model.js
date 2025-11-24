const mongoose = require("mongoose");

const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;

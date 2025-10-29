const express = require("express");
const { userAuth } = require("../middleware/auth");
const { Chat } = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req?.params;
  const userId = req?.user?._id;

  if (userId.equals(targetUserId)) {
    return res.status(400).json({ message: "Invalid target user" });
  }

  if (!userId || !targetUserId) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json({ message: "Chat fetched successfully", data: chat });
  } catch (err) {
    res.status(500).json({ message: "Error fetching chat" });
  }
});

module.exports = chatRouter;

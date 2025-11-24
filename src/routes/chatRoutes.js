const express = require("express");
const { userAuth } = require("../middleware/auth");
const chatService = require("../services/chat.service");

const chatRouter = express.Router();

chatRouter.get("/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  if (userId.equals(targetUserId)) {
    return res.status(400).json({ message: "Invalid target user" });
  }

  try {
    const chat = await chatService.getOrCreateChat(userId, targetUserId);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const messages = await chatService.getMessages(chat._id, page, limit);

    res.json({
      message: "Chat fetched successfully",
      data: { chat, messages },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching chat" });
  }
});

module.exports = chatRouter;

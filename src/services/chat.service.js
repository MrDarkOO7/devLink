const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

exports.getOrCreateChat = async (userA, userB) => {
  let chat = await Chat.findOne({
    participants: { $all: [userA, userB] },
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [userA, userB],
    });
  }

  return chat;
};

exports.getMessages = async (chatId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const messages = await Message.find({ chatId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return messages.reverse();
};

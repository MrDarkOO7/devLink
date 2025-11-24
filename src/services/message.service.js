const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

exports.addMessage = async (chatId, senderId, text) => {
  const message = await Message.create({
    chatId,
    senderId,
    text,
  });

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: message._id,
  });

  return message;
};

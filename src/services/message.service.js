const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const { createNotification } = require("../utils/notify");

exports.addMessage = async (chatId, senderId, text) => {
  const message = await Message.create({
    chatId,
    senderId,
    text,
  });

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: message._id,
  });

  const chat = await Chat.findById(chatId).populate(
    "participants",
    "_id firstName lastName"
  );
  const targetUserForNotification = chat.participants.find(
    (member) => member._id.toString() !== senderId.toString()
  );
  const senderUser = chat.participants.find(
    (member) => member._id.toString() === senderId.toString()
  );

  const senderName = `${senderUser.firstName} ${senderUser.lastName}`;

  await createNotification({
    userId: targetUserForNotification._id,
    type: "message",
    message: `New message from ${senderName}`,
    metadata: { senderId, chatId },
  });

  return { message, senderUser, targetUserForNotification };
};

const socket = require("socket.io");
const corsOptions = require("../utils/cors");
const chatService = require("../services/chat.service");
const messageService = require("../services/message.service");

let io = null;

const initializeSocket = (server) => {
  io = socket(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ chatId }) => {
      socket.join(chatId);
    });

    socket.on("sendMessage", async ({ chatId, senderId, text }) => {
      try {
        const { message, senderUser, targetUserForNotification } =
          await messageService.addMessage(chatId, senderId, text);

        console.log("sendMessage:", chatId, senderId, text);

        io.to(chatId).emit("messageReceived", message);

        io.to(targetUserForNotification._id.toString()).emit("notification", {
          type: "message",
          from: {
            id: senderUser._id,
            name: `${senderUser.firstName} ${senderUser.lastName}`,
          },
          chatId,
        });
      } catch (err) {
        console.log("Socket message error:", err);
      }
    });

    socket.on("registerUser", (userId) => {
      socket.join(userId.toString());
      console.log("User registered for notifications:", userId);
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initializeSocket, getIO };

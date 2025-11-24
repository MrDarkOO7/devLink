const socket = require("socket.io");
const corsOptions = require("../utils/cors");
const chatService = require("../services/chat.service");
const messageService = require("../services/message.service");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ chatId }) => {
      socket.join(chatId);
    });

    socket.on("sendMessage", async ({ chatId, userId, text }) => {
      try {
        const message = await messageService.addMessage(chatId, userId, text);
        console.log("sendMessage:", chatId, userId, text);

        io.to(chatId).emit("messageReceived", message);
      } catch (err) {
        console.log("Socket message error:", err);
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

module.exports = initializeSocket;

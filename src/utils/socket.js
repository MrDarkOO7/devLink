const socket = require("socket.io");
const corsOptions = require("./cors");
const { Chat } = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log("Joining room: ", roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ userId, targetUserId, text }) => {
      const roomId = [userId, targetUserId].sort().join("_");

      try {
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({ senderId: userId, text });
        await chat.save();

        io.to(roomId).emit("messageReceived", { fromUser: userId, text });
      } catch (err) {
        console.log("error during sendMessage: ", err);
      }

      console.log("New Message: ", text);
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;

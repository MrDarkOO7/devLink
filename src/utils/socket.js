const socket = require("socket.io");
const corsOptions = require("./cors");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", () => {});

    socket.on("sendMessage", () => {});

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;

require("dotenv").config();
const express = require("express");

const connectDB = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const requestRoutes = require("./routes/requests");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const corsOptions = require("./utils/cors");
const initializeSocket = require("./utils/socket");

const app = express();

// Apply middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/request", requestRoutes);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

const server = http.createServer(app);
initializeSocket(server);

// Connect to database and start server
connectDB()
  .then(() => {
    console.log("Database connected");
    server.listen(8080);
    console.log("listening on port 8080...");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

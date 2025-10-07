const express = require("express");

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const requestRoutes = require("./routes/requests");
const userRoutes = require("./routes/user");

const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/request", requestRoutes);
app.use("/user", userRoutes);

// Connect to database and start server
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(8080);
    console.log("listening on port 8080...");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

// // Middleware to handle CORS
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Credentials", "true");
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).json({});
//   }
//   next();
// });

const express = require("express");

const connectDB = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const requestRoutes = require("./routes/requests");
const userRoutes = require("./routes/user");

const app = express();
// Allowed origins (no trailing slashes)
// include your local dev host(s) and the deployed host(s)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",      // add if you use port 3000 sometimes
  "http://127.0.0.1:3000",
  "http://44.220.134.112",
  "https://44.220.134.112"      // include https variant if you serve over TLS
];

// dynamic origin checking (this echoes origin when allowed — required for credentials)
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman, curl, or server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      // respond with the specific origin (not "*") — required for cookies
      return callback(null, true);
    }
    // not allowed
    return callback(new Error("CORS policy: Origin not allowed"), false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};

// Apply middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));       // <-- pass options here
// app.options("*", cors(corsOptions)); 
// app.use(cors());

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

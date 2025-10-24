const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://44.220.134.112",
  "https://44.220.134.112",
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
  optionsSuccessStatus: 204,
};

module.exports = corsOptions;

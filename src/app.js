const express = require("express");

const connectDB = require("./config/database");
const UserModel = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validateSignupData } = require("./utils/validations");
const { userAuth } = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

// User signup
app.post("/signup", async (req, res) => {
  console.log("Request body:", req.body);

  const { valid, message } = validateSignupData(req);
  if (!valid) {
    return res.status(400).send(message);
  }

  const { firstName, lastName, emailId, password } = req.body;
  const user = new UserModel({
    firstName,
    lastName,
    emailId,
    password: await bcrypt.hash(password, 10),
  });

  try {
    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("Error signing up user: ", err.message);
  }
});

// User login
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  if (!emailId || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const user = await UserModel.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Invalid password");
    }

    const auth_token = await user.getJWT();
    if (!auth_token) {
      return res.status(500).send("Error generating auth token");
    }

    res.cookie("auth_token", auth_token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.send("User logged in successfully");
  } catch (err) {
    return res.status(500).send("Error logging in user: ", err.message);
  }
});

// Get user profile
app.get("/profile", userAuth, async (req, res) => {
  const user = req.user;

  const userData = user.toJSON();
  res.json(userData);
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(`${user.firstName} is sending connection request`);
});

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

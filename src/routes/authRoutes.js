const express = require("express");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validations");
const router = express.Router();

// User signup
router.post("/signup", async (req, res) => {
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
    res.json({ message: "User signed up successfully" });
  } catch (err) {
    res.status(400).send("Error signing up user: ", err.message);
  }
});

// User login
router.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const user = await UserModel.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const data = await user.toJSON();

    const isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Invalid password");
    }

    const auth_token = await user.getJWT();
    if (!auth_token) {
      return res.status(500).send("Error generating auth token");
    }

    res.cookie("auth_token", auth_token, {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    });

    res.json({ data: data, message: "User logged in successfully" });
  } catch (err) {
    console.log("Error logging in ", err);
    return res.status(500).send("Error logging in user: ", err.message);
  }
});

// User Logout
router.post("/logout", (req, res) => {
  res.cookie("auth_token", null, {
    maxAge: new Date(Date.now()),
    secure: true,
    sameSite: "none",
  });
  res.send("User logged out successfully");
});

module.exports = router;

const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Waleeddd",
    lastName: "Idre",
    emailId: "m.waled@gmail.co",
    password: "Testing@123",
    age: 22,
    gender: "Male",
  };

  const user = new UserModel(userObj);
  try {
    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("Error signing up user: ", err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(8080);
    console.log("listening on port 8080...");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

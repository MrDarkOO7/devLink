const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log("Request body:", req.body);
  const userData = req.body;

  const user = new UserModel(userData);
  try {
    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("Error signing up user: ", err.message);
  }
});

app.get("/user", async (req, res) => {
  const email = req.body?.emailId;
  if (!email) {
    return res.status(400).send("Email is required");
  }
  console.log("Fetching user with email:", email);
  try {
    const user = await UserModel.findOne({ emailId: email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (err) {
    return res.status(500).send("Error fetching user: ", err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await UserModel.find({});
    if (!users || users.length === 0) {
      return res.status(404).send("No users found");
    }
    res.json(users);
  } catch (err) {
    return res.status(500).send("Error fetching user: ", err.message);
  }
});

app.patch("/user", async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(400).send("user data is required");
  }
  console.log("Updating user with userId:", data?.userId);
  try {
    const result = await UserModel.findByIdAndUpdate(data?.userId, data);
    console.log(result);
    if (!result) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  } catch (err) {
    return res.status(500).send("Error updating user: ", err.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body?.userId;
  if (!userId) {
    return res.status(400).send("userId is required");
  }
  console.log("Deleting user with userId:", userId);
  try {
    const result = await UserModel.findByIdAndDelete(userId);
    console.log(result);
    if (result.deletedCount === 0) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (err) {
    return res.status(500).send("Error deleting user: ", err.message);
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

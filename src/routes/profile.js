const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validations");
const UserModel = require("../models/user");
const router = express.Router();

// Get user profile
router.get("/view", userAuth, async (req, res) => {
  const user = req.user;

  const userData = user.toJSON();
  res.json({ data: userData, message: "User fetched successfully" });
});

// Get user profile by id
router.get("/:id", userAuth, async (req, res) => {
  const userId = req?.params?.id;
  if (!userId) {
    return res.status(400).json({ message: "User Id required in params" });
  }
  try {
    const userProfile = await UserModel.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }
    const userData = await userProfile.toJSON();

    res.json({ data: userData, message: "User profile fetched successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user profile");
  }
});

// Edit user profile
router.patch("/edit", userAuth, async (req, res) => {
  const userDoc = req.user;
  const userNew = req?.body;
  if (!userNew) {
    res.status(400).send("Send user details to update");
  }

  try {
    const isValidUpdates = validateEditProfileData(userNew);
    if (isValidUpdates) {
      Object.keys(userNew).forEach((key) => {
        userDoc[key] = userNew[key];
      });

      await userDoc.save();
      res.json({
        success: true,
        userData: userDoc,
        message: "Profile updated",
      });
    }
  } catch (err) {
    res.status(500).send("Error updating profile: " + err.message);
  }
});

module.exports = router;

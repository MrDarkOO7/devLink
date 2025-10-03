const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validations");
const router = express.Router();

// Get user profile
router.get("/view", userAuth, async (req, res) => {
  const user = req.user;

  const userData = user.toJSON();
  res.json(userData);
});

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

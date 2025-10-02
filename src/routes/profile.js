const express = require("express");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

// Get user profile
router.get("/profile", userAuth, async (req, res) => {
  const user = req.user;

  const userData = user.toJSON();
  res.json(userData);
});

module.exports = router;

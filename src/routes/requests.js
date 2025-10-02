const express = require("express");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

router.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(`${user.firstName} is sending connection request`);
});

module.exports = router;

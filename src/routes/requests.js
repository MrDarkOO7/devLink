const express = require("express");
const { userAuth } = require("../middleware/auth");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// Send a connection request
router.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    const { toUserId, status } = req.params;

    if (!fromUserId || !toUserId || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userValid = User.findById(toUserId);
    if (!userValid) {
      return res.status(404).json({ message: "User not found" });
    }

    const validStatuses = ["ignored", "interested"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status value " + status });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }
    const newRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await newRequest.save();
    return res.status(200).json({ message: "Connection request sent" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: err.message || "Server Error", error: true });
  }
});

module.exports = router;

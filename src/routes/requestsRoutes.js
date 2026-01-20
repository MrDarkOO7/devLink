const express = require("express");
const { userAuth } = require("../middleware/auth");
const router = express.Router();
const { getIO } = require("../sockets/Socket");
const { createNotification } = require("../utils/notify");
const ConnectionRequest = require("../models/connectionRequest.model");
const User = require("../models/user.model");

// Send a connection request
router.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    const senderName = user.firstName + " " + user.lastName || "A user";
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

    if (status === "interested") {
      await createNotification({
        userId: toUserId,
        type: "request_sent",
        message: `${senderName} sent you a connection request`,
        metadata: { senderId: fromUserId },
      });

      const io = getIO();
      io.to(toUserId.toString()).emit("notification", {
        type: "request_sent",
        message: `${senderName} sent you a connection request`,
      });
    }

    return res.status(200).json({ message: "Connection request sent" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: err.message || "Server Error", error: true });
  }
});

// (accept or reject) connection request by requestId
router.post("/review/:status/:requestId", userAuth, async (req, res) => {
  const user = req.user;
  const { status, requestId } = req.params;
  if (!status || !requestId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const validStatuses = ["accepted", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status passed" });
  }

  try {
    const request = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: user._id,
      status: "interested",
    });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    request.status = status;
    const data = await request.save();
    const notifyUserId = request.fromUserId;

    if (status === "accepted") {
      await createNotification({
        userId: notifyUserId,
        type: "request_accepted",
        message: `${
          user.firstName + " " + user.lastName
        } accepted your connection request`,
        metadata: { senderId: notifyUserId },
      });

      const io = getIO();
      io.to(notifyUserId.toString()).emit("notification", {
        type: "request_accepted",
        message: `${
          user.firstName + " " + user.lastName
        } accepted your connection request`,
      });
    }

    return res
      .status(200)
      .json({ message: "Connection Request " + status, data });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server Error" });
  }
});

module.exports = router;

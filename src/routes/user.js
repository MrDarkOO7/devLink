const express = require("express");
const userRoutes = express.Router();

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// Get connection requests received by the logged-in user
userRoutes.get("/requests/received", userAuth, async (req, res) => {
  const loggedInUser = req?.user;
  try {
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName profilePicture");
    return res
      .status(200)
      .json({ message: "Requests fetched successfully", connectionRequests });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: err.message || "Server Error", error: true });
  }
});

// Get connections of a logged-in user
userRoutes.get("/connections", userAuth, async (req, res) => {
  const loggedInUser = req?.user;
  try {
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser?._id, status: "accepted" },
        { fromUserId: loggedInUser?._id, status: "accepted" },
      ],
    }).populate(
      "fromUserId toUserId",
      "firstName lastName profilePicture headline"
    );

    const formattedConnections = connections.map((connection) => {
      const isFromUser = connection.fromUserId._id.equals(loggedInUser._id);
      const otherUser = isFromUser
        ? connection.toUserId
        : connection.fromUserId;
      return {
        _id: otherUser._id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        profilePicture: otherUser.profilePicture,
        headline: otherUser.headline,
      };
    });

    return res.status(200).json({
      message: "Connections fetched successfully",
      formattedConnections,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: err.message || "Server Error", error: true });
  }
});

// Get user feed suggestions
userRoutes.get("/feed", userAuth, async (req, res) => {
  const loggedInUser = req?.user;

  try {
    const initiatedConnections = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser?._id }, { fromUserId: loggedInUser?._id }],
    });
    const excludedUserIds = initiatedConnections.reduce((ids, conn) => {
      ids.add(conn.fromUserId.toString());
      ids.add(conn.toUserId.toString());
      return ids;
    }, new Set());
    excludedUserIds.add(loggedInUser?._id.toString());

    const suggestions = await User.find({
      _id: { $nin: Array.from(excludedUserIds) },
    })
      .select("firstName lastName profilePicture headline")
      .limit(10);

    return res.status(200).json({
      message: "User feed fetched successfully",
      excludedUserIds: Array.from(excludedUserIds),
      suggestions,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: err.message || "Server Error", error: true });
  }
});

module.exports = userRoutes;

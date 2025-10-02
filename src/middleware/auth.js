const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const userAuth = async (req, res, next) => {
  const cookies = req?.cookies;

  if (!cookies || !cookies.auth_token) {
    return res.status(401).send("Unauthorized");
  }
  const token = cookies.auth_token;
  try {
    const decodedObj = await jwt.verify(
      token,
      "WELCOME_TO_DEVLINK",
      (err, decodedObj) => {
        if (err?.name === "TokenExpiredError") {
          return res.status(401).send("Token expired");
        }
        if (err) {
          return res.status(401).send("Invalid token" + err.message);
        }

        return decodedObj;
      }
    );
    const userId = decodedObj?._id;
    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User Not Found");
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).send("Error authenticating user: " + err);
  }
};

module.exports = { userAuth };

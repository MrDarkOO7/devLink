const mongoose = require("mongoose");
const validate = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, minLength: 3, maxLength: 30 },
    lastName: { type: String },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validate.isURL(value)) {
          throw new Error("Invalid Photo URL");
        }
      },
    },
    skills: { type: [String], default: [] },
    bio: { type: String, maxLength: 250 },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id.toString() },
    "WELCOME_TO_DEVLINK",
    {
      expiresIn: "1d",
    }
  );
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  return isPasswordMatch;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  return userObject;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;

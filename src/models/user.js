const mongoose = require("mongoose");
const validate = require("validator");

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

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;

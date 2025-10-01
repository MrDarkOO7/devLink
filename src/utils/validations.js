const validate = require("validator");

validateSignupData = (req) => {
  const {
    firstName,
    lastName,
    userId,
    emailId,
    password,
    age,
    gender,
    bio,
    skills,
    photoUrl,
  } = req.body;

  if (!firstName || firstName.length < 3 || firstName.length > 30) {
    if (!firstName) {
      return { valid: false, message: "First name is required" };
    }
    return { valid: false, message: "First name must be 4-30 characters long" };
  }
  if (!password || !validate.isStrongPassword(password)) {
    return { valid: false, message: "Password is not strong enough" };
  }
  if (!emailId || !validate.isEmail(emailId)) {
    if (!emailId) {
      return { valid: false, message: "Email is required" };
    }
    return { valid: false, message: "Invalid email format" };
  }
  if (lastName && (lastName.length < 3 || lastName.length > 30)) {
    return { valid: false, message: "Last name must be 4-30 characters long" };
  }
  if (age && age < 18) {
    return { valid: false, message: "Age must be at least 18" };
  }
  if (photoUrl && !validate.isURL(photoUrl)) {
    return { valid: false, message: "Invalid Photo URL" };
  }
  if (bio && bio.length > 250) {
    return { valid: false, message: "Bio cannot exceed 250 characters" };
  }
  if (skills && skills.length > 10) {
    return { valid: false, message: "Skills cannot be more than 10" };
  }

  return { valid: true, message: "Valid data" };
};

module.exports = { validateSignupData };

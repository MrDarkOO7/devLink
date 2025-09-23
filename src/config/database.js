const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://MrDarkOO7:mongoidwaleed@nodelearn.gaiwtxc.mongodb.net/devLink"
  );
};

module.exports = connectDb;

// module.exports = mongoose;

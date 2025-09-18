const express = require("express");

const app = express();

app.use("/add", (req, res) => {
  res.send("Hello Express!");
});

app.listen(8080);
console.log("listening on port 8080...");

const express = require("express");

const app = express();

app.post("/create-room", (req, res) => {
  res.send({
    message: "New user was added to the list",
  });
});

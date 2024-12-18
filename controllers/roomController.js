const express = require("express");
const rooms = require('./mocks/rooms.json')

const app = express();

app.post("/create-room", (req, res) => {
  console.log(req.query)
  res.send(rooms);
});

// TODO: call this file in index.js
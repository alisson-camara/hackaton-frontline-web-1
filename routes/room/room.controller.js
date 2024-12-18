
import { Router } from 'express';
const express = require("express");
const rooms = require('./mocks/rooms.json')

const router = Router();

router.post("/create-room", (req, res) => {
  console.log(req.query)
  res.send(rooms);
});


// TODO: call this file in index.js
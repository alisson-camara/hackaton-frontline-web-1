
import { Router } from 'express';
const express = require("express");
const rooms = require('./mocks/rooms.json')

const router = Router();

router.post("/create-room", (req, res) => {
  const data = req.body;
  console.log("Received data:", data);
  res.status(200).send({ message: "Data received successfully", data });
});


// TODO: call this file in index.js
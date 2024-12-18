const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5006;

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/index");
});

// CREATE ROOM #TODO = Add to database
app.post("/create-room", (req, res) => {
  const data = req.body;
  const roomName = req.query.room;
  const moderator = req.query.moderator;

  if (!roomName) {
    return res
      .status(400)
      .send({ message: "Missing required fields: roomName" });
  }
  if (!moderator) {
    return res
      .status(400)
      .send({ message: "Missing required fields: moderator" });
  }

  const room = {
    name: roomName,
    currentTask: "Task 1",
    moderator: moderator,
    players: [
      {
        name: moderator,
        point: "?",
      },
    ],
  };

  res.status(200).send(room);
});

// GET ROOM #TODO = Add to database
app.get("/room", (req, res) => {
  const data = req.body;
  const roomName = req.query.room;

  if (!roomName) {
    return res
      .status(400)
      .send({ message: "Missing required fields: roomName" });
  }

  const room = {
    name: roomName,
    currentTask: "Task 1",
    moderator: "moderator",
    players: [
      {
        name: "player",
        point: "?",
      },
    ],
  };

  res.status(200).send({ room });
});

const server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: gracefully shutting down");
  if (server) {
    server.close(() => {
      console.log("HTTP server closed");
    });
  }
});

/*
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

client.query(
  "SELECT table_schema,table_name FROM information_schema.tables;",
  (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  }
);

*/

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const port = process.env.PORT || 5006;
const prisma = new PrismaClient();

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.post("/create-room", async (req, res) => {
  const roomName = req.query.room;
  const moderator = req.query.moderator;

  if (!roomName) {
    return res.status(400).send({ message: "Missing required fields: room" });
  }
  if (!moderator) {
    return res
      .status(400)
      .send({ message: "Missing required fields: moderator" });
  }

  const room = {
    room: roomName,
    currentTask: "Task 1",
    moderator: moderator,
    players: [
      {
        name: moderator,
        point: "?",
      },
    ],
  };

  await prisma.rooms.create({
    data: room,
  });

  res.status(200).send(room);
});

app.get("/room", async (req, res) => {
  const roomName = req.query.room;

  if (!roomName) {
    return res.status(400).send({ message: "Missing required fields: room" });
  }

  const rooms = await prisma.rooms.findFirst({
    where: {
      room: roomName,
    },
  });

  res.status(200).send(rooms);
});

app.post("/join-room", async (req, res) => {
  const roomName = req.query.room;
  const player = req.query.player;

  if (!roomName) {
    return res.status(400).send({ message: "Missing required fields: room" });
  }

  if (!player) {
    return res.status(400).send({ message: "Missing required fields: player" });
  }

  const rooms = await prisma.rooms.findFirst({
    where: {
      room: roomName,
    },
  });

  if (!rooms) {
    return res.status(404).send({ message: "Room not found" });
  }

  const players = rooms.players;

  const playerExists = players.find(
    (currentPlayer) => currentPlayer.name === player
  );

  if (playerExists) {
    return res
      .status(400)
      .send({ message: "player cannot contain the same name" });
  }

  players.push({
    name: player,
    point: "?",
  });

  const updatedRoom = await prisma.rooms.updateMany({
    where: {
      room: roomName,
    },
    data: {
      players: players,
    },
  });

  res.status(200).send(updatedRoom);
});

app.post("/remove-player", async (req, res) => {
  const roomName = req.query.room;
  const player = req.query.player;
  const bodyPlayer = req.body

  if (!roomName) {
    return res.status(400).send({ message: "Missing required fields: room" });
  }

  if (!player) {
    return res.status(400).send({ message: "Missing required fields: player" });
  }

  if (!bodyPlayer) {
    return res.status(400).send({ message: "Missing required body as player name" });
  }

  const room = await prisma.rooms.findFirst({
    where: {
      room: roomName,
    },
  });

  if (!room) {
    return res.status(404).send({ message: "Room not found" });
  }

  const players = room.players;
  const newPlayers = players.reduce((previous, current) => {
    if (current.name === player) {
      return previous;
    }
    return [...previous, current];
  }, []);

  const updatedRoom = await prisma.rooms.updateMany({
    where: {
      room: roomName,
    },
    data: {
      players: newPlayers,
    },
  });

  res.status(200).send(updatedRoom);
});

app.post("/sendvote",  async (req, res) => {
  const roomName = req.query.room;
  const player = req.query.player;
  const point = req.body.point;

  if (!roomName || !player) {
    const missingField = !roomName ? 'room' : 'player'
    return res.status(400).send({ message: `Missing required fields: ${missingField}` });
  }

  if (!point) {
    return res.status(400).send({ message: "Missing required body as point" });
  }

  const room = await prisma.rooms.findFirst({
    where: {
      room: roomName,
    },
    select:{player}
  });
  
  console.log(room);
  const playerWithNewVote = room.players.map((player) => {
    if (player.name === player) {
      return {
        ...player,
        point
      }
    }
  });

  // TODO: Update point of body
  await prisma.rooms.updateOne({
    where: {
      room: roomName,
    },
    data: {
      players: playerWithNewVote,
    },
  });

  res.status(200).send(room);
});

// POST RESET VOTES #TODO = Add to database
app.post("/reset-votes", (req, res) => {
  const roomName = req.query.room;
  const player = req.query.player;

  if (!roomName) {
    return res.status(400).send({ message: "Missing required fields: room" });
  }

  if (!player) {
    return res.status(400).send({ message: "Missing required fields: player" });
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

  room.players.map((currentPlayer) => {
    if (currentPlayer === player)
      return {
        ...currentPlayer,
        point: "?",
      };
    return currentPlayer;
  });

  res.status(200).send(room);
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

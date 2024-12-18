const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const port = process.env.PORT || 5006;
const prisma = new PrismaClient();

const app = express();
app.use(bodyParser.json({ strict: false }));

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/index");
});

// POST /create-room
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

// GET room
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


// POST join-room
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

// POST remove-player
app.post("/remove-player", async (req, res) => {
  const roomName = req.query.room;
  const player = req.query.player;
  const bodyPlayer = req.body;

  if (!roomName) {
    return res.status(400).send({ message: "Missing required fields: room" });
  }

  if (!player) {
    return res.status(400).send({ message: "Missing required fields: player" });
  }

  if (!bodyPlayer) {
    return res
      .status(400)
      .send({ message: "Missing required body as player name" });
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

// POST sendvode
app.post("/sendvote", async (req, res) => {
  const roomName = req.query.room;
  const player = req.query.player;
  const point = req.body;

  if (!roomName || !player) {
    const missingField = !roomName ? "room" : "player";
    return res
      .status(400)
      .send({ message: `Missing required fields: ${missingField}` });
  }

  console.log(point);
  if (!point) {
    return res.status(400).send({ message: "Missing required body as point" });
  }

  const room = await prisma.rooms.findFirst({
    where: {
      room: roomName,
    },
  });

  if (!room) {
    return res.status(404).send({ message: "Room not found" });
  }

  const playerWithNewVote = room.players.map((p) => {
    if (p.name === player) {
      return {
        name: p.name,
        point: point.toString(),
      };
    }
    return player;
  });
  console.log("playerWithNewVote", playerWithNewVote);

  const newRoom = await prisma.rooms.updateMany({
    where: {
      room: roomName,
    },
    data: {
      players: playerWithNewVote,
    },
  });

  res.status(200).send(newRoom);
});

// POST reset-votes
app.post("/reset-votes", async (req, res) => {
  const roomName = req.query.room;
  const player = req.query.player;

  if (!roomName) {
    return res.status(400).send({ message: "Missing required fields: room" });
  }

  if (!player) {
    return res.status(400).send({ message: "Missing required fields: player" });
  }

  const room = await prisma.rooms.findFirst({
    where: {
      room: roomName,
    },
  });

  if (!room) {
    return res.status(404).send({ message: "Room not found" });
  }

  const newPlayersVote = room.players.map((currentPlayer) => {
    if (currentPlayer.name === player)
      return {
        ...currentPlayer,
        point: "?",
      };
    return currentPlayer;
  });

  const newRoom = await prisma.rooms.updateMany({
    where: {
      room: roomName,
    },
    data: {
      players: newPlayersVote,
    },
  });

  res.status(200).send(newRoom);
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

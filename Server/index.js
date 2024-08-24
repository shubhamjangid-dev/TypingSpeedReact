import express from "express";
import { nanoid } from "nanoid";
const app = express();

import http from "http";

const server = http.createServer(app);

import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.get("/", (req, res) => {
  res.send("<h1>Web Socket Server Running ... </h1>");
});
const rooms = {};
const privateRooms = {};
// structure of room = {
//   roomId : {
//     status: "wait","running","closed",
//     playerOne:,
//     playerTwo:

//   }
// };
const uniqueWords = [
  "apple",
  "breeze",
  "crystal",
  "dawn",
  "echo",
  "flame",
  "glimmer",
  "harmony",
  "illusion",
  "jungle",
  "kaleidoscope",
  "labyrinth",
  "melody",
  "nebula",
  "oasis",
  "paradox",
  "quartz",
  "ripple",
  "serenity",
  "twilight",
  "umbrella",
  "velocity",
  "whisper",
  "xenon",
  "yonder",
  "zenith",
  "azure",
  "blossom",
  "cascade",
  "drizzle",
  "ember",
  "fable",
  "galaxy",
  "haven",
  "infinity",
  "jewel",
  "kismet",
  "luminous",
  "mystic",
  "nirvana",
  "oracle",
  "phoenix",
  "quiver",
  "radiance",
  "spectrum",
  "tranquil",
  "unison",
  "vortex",
  "wander",
  "xylophone",
  "yearn",
  "zephyr",
  "amber",
  "boulder",
  "celestial",
  "diamond",
  "essence",
  "feather",
  "glisten",
  "horizon",
  "illusion",
  "jubilant",
  "kinetic",
  "lullaby",
  "mirage",
  "noble",
  "odyssey",
  "pulse",
  "quintessence",
  "reverie",
  "solstice",
  "tempest",
  "utopia",
  "verdant",
  "whimsy",
  "xenial",
  "youth",
  "zeal",
  "alchemy",
  "bliss",
  "coral",
  "dazzle",
  "epiphany",
  "frost",
  "gale",
  "hollow",
  "ignite",
  "journey",
  "kale",
  "lunar",
  "mosaic",
  "nymph",
  "overture",
  "prism",
  "quasar",
  "radiant",
  "silhouette",
  "tapestry",
  "untamed",
  "vista",
  "whisper",
  "xenolith",
  "yearning",
  "zen",
  "anthem",
  "breeze",
  "chasm",
  "drift",
  "ember",
  "flicker",
  "garnet",
  "haven",
  "insight",
  "joyful",
  "keystone",
  "legend",
  "miracle",
  "novel",
  "obsidian",
  "pinnacle",
  "quicksilver",
  "relic",
  "starlight",
  "treasure",
  "unveil",
  "verdure",
  "wisp",
  "xanadu",
  "yonder",
  "zodiac",
  "amethyst",
  "brisk",
  "cobblestone",
  "dune",
  "essence",
  "flourish",
  "glow",
  "harmony",
  "iridescent",
  "jovial",
  "kindle",
  "lore",
  "meadow",
  "nocturne",
  "orion",
  "pristine",
  "quench",
  "resonance",
  "solace",
  "terrain",
  "untold",
  "vivid",
  "whimsy",
  "xenon",
  "yarn",
  "zenith",
  "aperture",
  "breath",
  "cliff",
  "dew",
  "enigma",
  "fern",
  "gleam",
  "hollow",
  "illusion",
  "jade",
  "kismet",
  "labyrinth",
  "mystery",
  "nebula",
  "oath",
  "pulse",
  "quiver",
  "ripple",
  "sapphire",
  "torrent",
  "uplift",
  "vista",
  "wonder",
  "xylophone",
  "yawn",
  "zephyr",
];

const generateString = () => {
  let str = "";
  for (let i = 0; i < 50; i++) {
    str += uniqueWords[Math.floor(Math.random() * 200)] + " ";
  }
  return str;
};

io.on("connection", async socket => {
  console.log("socket is connected successfully with socketId :", socket.id);

  // create Room
  socket.on("create-room", user => {
    const roomId = nanoid(10);
    privateRooms[roomId] = {
      status: "waiting",
      playerOne: null,
      playerTwo: null,
    };
    socket.emit("new-game-person", { roomId, socketId: socket.id });
    // console.log("pvt", privateRooms);
  });

  // join private Room
  socket.on("join-private-room", payload => {
    const roomId = payload.roomId;
    if (roomId != null && privateRooms[roomId]?.status === "waiting") {
      if (privateRooms[roomId].playerOne == null || privateRooms[roomId].playerOne._id == payload.user._id) {
        privateRooms[roomId].playerOne = payload.user;
        socket.join(roomId);
      } else if (privateRooms[roomId].playerTwo == null || privateRooms[roomId].playerTwo_id == payload.user._id) {
        privateRooms[roomId].playerTwo = payload.user;
        socket.join(roomId);
        privateRooms[roomId].status = "running";
      } else if (privateRooms[roomId].playerOne != null && privateRooms[roomId].playerTwo != null) {
        //TODO:
        // room occupied
      }
    }
  });
  // join Room
  socket.on("join-room", payload => {
    const roomId = payload.roomId;
    if (roomId != null && rooms[roomId]?.status === "waiting") {
      if (rooms[roomId].playerOne == null || rooms[roomId].playerOne._id == payload.user._id) {
        rooms[roomId].playerOne = payload.user;
        socket.join(roomId);
      } else if (rooms[roomId].playerTwo == null || rooms[roomId].playerTwo_id == payload.user._id) {
        rooms[roomId].playerTwo = payload.user;
        socket.join(roomId);
        rooms[roomId].status = "running";
      } else if (privateRooms[roomId].playerOne != null && privateRooms[roomId].playerTwo != null) {
        //TODO:
        // room occupied
      }
    }
  });

  // leave room
  socket.on("leave-room", payload => {
    socket.leave(payload.roomId);
  });

  // join unknown Room
  socket.on("join-unknown-room", payload => {
    // console.log(rooms);
    const roomId = Object.keys(rooms).find(key => rooms[key]?.status == "waiting");
    // console.log(roomId);

    if (roomId) {
      socket.join(roomId);
      socket.emit("new-game-person", { roomId, socketId: socket.id });
    } else {
      const roomId = nanoid(8);
      rooms[roomId] = {
        status: "waiting",
        playerOne: null,
        playerTwo: null,
      };
      socket.join(roomId);
      socket.emit("new-game-person", { roomId, socketId: socket.id });
    }
  });
  // getroom information
  socket.on("get-room", payload => {
    const roomId = payload.roomId;
    if (roomId.length == 10) {
      io.in(roomId).emit("get-room-info", { roomId, ...privateRooms[roomId] });
    } else {
      io.in(roomId).emit("get-room-info", { roomId, ...rooms[roomId] });
    }
  });

  // score transfering
  socket.on("sent-data", payload => {
    // console.log(payload);
    // io.emit("chat", payload); // send to everyone
    socket.to(payload.roomId).emit("recieved-data", payload); // send to everyone except sender
  });

  // game start
  socket.on("start-game", payload => {
    io.in(payload.roomId).emit("start-game", { roomId: payload.roomId, str: generateString() });
  });

  // on disconnect
  socket.on("disconnect", (reason, detail) => {
    console.log("disconnected -->", reason, socket.id);
  });

  // health check
  socket.on("hello", data => {
    console.log("hello", data);
  });
});
const port = 8888;
server.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

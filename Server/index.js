import express from "express";
import { nanoid } from "nanoid";
const app = express();

import http from "http";

const server = http.createServer(app);

import { Server } from "socket.io";
import { log } from "console";

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
//     status: "waiting","running","playing","closed",
//     playerOne:,
//     playerTwo:
//     words:
//     gameFinished : 0,1,2
//   }
// };
const uniqueWords = [
  // Easy (100 words)
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "am",
  "has",
  "have",
  "had",
  "do",
  "does",
  "did",
  "go",
  "went",
  "come",
  "came",
  "see",
  "saw",
  "eat",
  "ate",
  "run",
  "ran",
  "walk",
  "walked",
  "sit",
  "sat",
  "stand",
  "stood",
  "read",
  "write",
  "say",
  "said",
  "give",
  "gave",
  "get",
  "got",
  "make",
  "made",
  "find",
  "found",
  "know",
  "knew",
  "take",
  "took",
  "help",
  "helped",
  "play",
  "played",
  "like",
  "liked",
  "love",
  "loved",
  "want",
  "wanted",
  "need",
  "needed",
  "call",
  "called",
  "work",
  "worked",
  "ask",
  "asked",
  "answer",
  "answered",
  "start",
  "started",
  "stop",
  "stopped",
  "open",
  "opened",
  "close",
  "closed",
  "buy",
  "bought",
  "sell",
  "sold",
  "tell",
  "told",
  "look",
  "looked",
  "see",
  "saw",
  "hear",
  "heard",
  "feel",
  "felt",
  "smell",
  "smelled",
  "touch",
  "touched",
  "run",
  "ran",
  "jump",
  "jumped",
  "talk",
  "talked",
  "listen",
  "listened",

  // Medium (150 words)
  "ability",
  "absorb",
  "abundant",
  "achieve",
  "active",
  "adapt",
  "advice",
  "affect",
  "afford",
  "agree",
  "analyze",
  "announce",
  "apparent",
  "approach",
  "arrange",
  "attempt",
  "benefit",
  "calculate",
  "category",
  "challenge",
  "character",
  "circumstance",
  "clarify",
  "collect",
  "combine",
  "complex",
  "component",
  "conclude",
  "confirm",
  "consequence",
  "consider",
  "consistent",
  "construct",
  "consult",
  "contrast",
  "contribute",
  "convince",
  "coordinate",
  "create",
  "criticize",
  "current",
  "debate",
  "decide",
  "define",
  "demonstrate",
  "depend",
  "describe",
  "design",
  "determine",
  "develop",
  "difference",
  "discover",
  "discuss",
  "distribute",
  "economy",
  "effective",
  "efficient",
  "elaborate",
  "element",
  "eliminate",
  "emphasize",
  "encourage",
  "enforce",
  "engage",
  "enhance",
  "establish",
  "estimate",
  "evaluate",
  "evidence",
  "expand",
  "expect",
  "explain",
  "explore",
  "expose",
  "express",
  "extend",
  "factor",
  "feature",
  "final",
  "focus",
  "function",
  "generate",
  "identify",
  "illustrate",
  "impact",
  "implement",
  "imply",
  "improve",
  "indicate",
  "influence",
  "inform",
  "inquire",
  "inspect",
  "integrate",
  "interpret",
  "investigate",
  "involve",
  "justify",
  "knowledge",
  "maintain",
  "measure",
  "method",
  "modify",
  "motivate",
  "navigate",
  "observe",
  "obtain",
  "occur",
  "operate",
  "organize",
  "participate",
  "perceive",
  "perform",
  "persuade",
  "policy",
  "potential",
  "predict",
  "prepare",
  "presume",
  "previous",
  "process",
  "produce",
  "propose",
  "protect",
  "provide",
  "publish",
  "pursue",
  "react",
  "recognize",
  "recommend",
  "reduce",
  "refer",
  "reflect",
  "reform",
  "regulate",
  "relate",
  "relevant",
  "rely",
  "require",
  "research",
  "resolve",
  "respond",
  "restrict",
  "retain",
  "reveal",
  "risk",
  "secure",
  "select",
  "sequence",
  "shift",
  "significant",
  "source",
  "specify",
  "structure",
  "substitute",
  "succeed",
  "suggest",
  "summarize",
  "support",
  "sustain",
  "technique",
  "technology",
  "transform",
  "transmit",
  "translate",
  "undergo",
  "undertake",
  "utilize",
  "vary",
  "verify",
  "view",
  "visualize",
  "volume",
  "voluntary",
  "vulnerable",
  "widespread",
  "willing",
  "witness",
  "yield",
  "zone",

  // Difficult (50 words)
  "aberration",
  "abstruse",
  "acquiesce",
  "acrimony",
  "adumbrate",
  "ameliorate",
  "anathema",
  "antediluvian",
  "apocryphal",
  "arcanum",
  "ascetic",
  "assiduous",
  "belligerent",
  "camaraderie",
  "capitulate",
  "circumlocution",
  "clandestine",
  "cogent",
  "complacency",
  "conflagration",
  "connive",
  "consternation",
  "contentious",
  "contrite",
  "convivial",
  "corroborate",
  "culpable",
  "deleterious",
  "demagogue",
  "deride",
  "despot",
  "diaphanous",
  "diffident",
  "dissemble",
  "ebullient",
  "egregious",
  "enervate",
  "ephemeral",
  "equanimity",
  "esoteric",
  "evanescent",
  "exacerbate",
  "exculpate",
  "execrable",
  "exigent",
  "fastidious",
  "fatuous",
  "feral",
  "florid",
  "fractious",
];

const generateString = () => {
  let str = "";
  for (let i = 0; i < 20; i++) {
    str += uniqueWords[Math.floor(Math.random() * uniqueWords.length)] + " ";
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
      gameFinished: 0,
    };
    socket.emit("new-game-person", { roomId, socketId: socket.id });
    // console.log("pvt", privateRooms);
  });
  console.log();

  // join private Room
  socket.on("join-private-room", payload => {
    const roomId = payload.roomId;
    if (roomId != null) {
      if (privateRooms[roomId]?.status === "waiting") {
        if (privateRooms[roomId].playerOne == null || privateRooms[roomId].playerOne._id == payload.user._id) {
          privateRooms[roomId].playerOne = payload.user;
          socket.join(roomId);
        } else if (privateRooms[roomId].playerTwo == null || privateRooms[roomId].playerTwo._id == payload.user._id) {
          privateRooms[roomId].playerTwo = payload.user;
          socket.join(roomId);
          privateRooms[roomId].status = "running";
        }

        // {
        //TODO:
        // room occupied
        // }
      }
      if (privateRooms[roomId]?.status === "playing") {
        if (privateRooms[roomId].playerOne._id == payload.user._id) {
          socket.join(roomId);
        } else if (privateRooms[roomId].playerTwo._id == payload.user._id) {
          socket.join(roomId);
        }
      }
    }
  });
  // join Room
  socket.on("join-room", payload => {
    const roomId = payload.roomId;
    if (roomId != null) {
      if (rooms[roomId]?.status === "waiting") {
        if (rooms[roomId].playerOne == null || rooms[roomId].playerOne._id == payload.user._id) {
          rooms[roomId].playerOne = payload.user;
          socket.join(roomId);
        } else if (rooms[roomId].playerTwo == null || rooms[roomId].playerTwo._id == payload.user._id) {
          rooms[roomId].playerTwo = payload.user;
          socket.join(roomId);
          rooms[roomId].status = "running";
        }

        // {
        //TODO:
        // room occupied
        // }
      }
      if (rooms[roomId]?.status === "playing") {
        if (rooms[roomId].playerOne._id == payload.user._id) {
          socket.join(roomId);
        } else if (rooms[roomId].playerTwo._id == payload.user._id) {
          socket.join(roomId);
        }
      }
    }
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
        gameFinished: 0,
      };
      socket.join(roomId);
      socket.emit("new-game-person", { roomId, socketId: socket.id });
    }
  });

  // exit room
  socket.on("exit-room", payload => {
    const roomId = payload?.roomId;
    socket.leave(roomId);
    if (roomId.length == 10) {
      if (privateRooms[roomId].playerOne && privateRooms[roomId].playerOne._id == payload.user._id) {
        privateRooms[roomId].playerOne = null;
      } else if (privateRooms[roomId].playerTwo && privateRooms[roomId].playerTwo._id == payload.user._id) {
        privateRooms[roomId].playerTwo = null;
      }

      if (privateRooms[roomId].playerOne == null && privateRooms[roomId].playerTwo == null) {
        delete privateRooms[roomId];
      }
    } else if (roomId.length == 8) {
      if (rooms[roomId].playerOne && rooms[roomId].playerOne._id == payload.user._id) {
        rooms[roomId].playerOne = null;
      } else if (rooms[roomId].playerTwo && rooms[roomId].playerTwo._id == payload.user._id) {
        rooms[roomId].playerTwo = null;
      }

      if (rooms[roomId].playerOne == null && rooms[roomId].playerTwo == null) {
        delete rooms[roomId];
      }
    }
  });

  // getroom information
  socket.on("get-room", payload => {
    const roomId = payload.roomId;
    if (roomId.length == 10) {
      io.in(roomId).emit("get-room-info", { roomId, ...privateRooms[roomId] });
    } else if (roomId.length == 8) {
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
  socket.on("play-again", payload => {
    const roomId = payload?.roomId;
    // console.log(roomId);
    const str = generateString();
    if (roomId.length == 10) {
      privateRooms[roomId] = { ...privateRooms[roomId], status: "running", gameFinished: 0, playerOneResult: null, playerTwoResult: null, words: "" };
      console.log(privateRooms[roomId]);
    } else if (roomId.length == 8) {
      rooms[roomId] = { ...rooms[roomId], status: "running", gameFinished: 0, playerOneResult: null, playerTwoResult: null, words: "" };
      console.log("room", rooms[roomId]);
    }

    io.in(payload.roomId).emit("play-again", { roomId: payload.roomId, str });
  });
  // game start
  socket.on("start-game", payload => {
    const roomId = payload.roomId;
    const str = generateString();
    // console.log(payload);

    if (roomId.length == 10) {
      // console.log(privateRooms[roomId]);
      if (privateRooms[roomId].status == "playing") return;
      privateRooms[roomId] = { ...privateRooms[roomId], status: "playing", words: str };
    } else if (roomId.length == 8) {
      // console.log("room ", rooms[roomId]);
      if (rooms[roomId]?.status == "playing") return;
      rooms[roomId] = { ...rooms[roomId], status: "playing", words: str };
    }

    io.in(payload.roomId).emit("start-game", { roomId: payload.roomId, str });
  });

  // generate result
  socket.on("generate-result", payload => {
    const roomId = payload.roomId;

    if (roomId.length == 10) {
      if (privateRooms[roomId].playerOne._id == payload.userId) {
        privateRooms[roomId].playerOneResult = payload.resultData;
      } else {
        privateRooms[roomId].playerTwoResult = payload.resultData;
      }

      //  TODO: SEND RESULT
      io.in(roomId).emit("finish-game", { roomId, ...privateRooms[roomId] });
      if (privateRooms[roomId].gameFinished == 0) {
        privateRooms[roomId].gameFinished = 1;
      }
    } else if (roomId.length == 8) {
      console.log(payload);
      if (rooms[roomId].playerOne._id == payload.userId) {
        rooms[roomId].playerOneResult = payload.resultData;
      } else {
        rooms[roomId].playerTwoResult = payload.resultData;
      }

      //  TODO: SEND RESULT
      io.in(roomId).emit("finish-game", { roomId, ...rooms[roomId] });
      if (rooms[roomId].gameFinished == 0) {
        rooms[roomId].gameFinished = 1;
      }
    }
  });

  // on disconnect
  socket.on("disconnecting", () => {
    console.log("disconnecting", socket.rooms); // the Set contains at least the socket ID
  });

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

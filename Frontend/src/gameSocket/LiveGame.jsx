import React, { useEffect, useRef, useState } from "react";
import FormatChar from "./FormatChar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LiveResult from "./LiveResult.jsx";
import WaitingUser from "./WaitingUser.jsx";

function LiveGame({ socket }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roomId } = useParams();
  const user = useSelector(state => state.userData.userData);

  // web socket
  const [words, setWords] = useState("a room with words and set words array and play game with your favorite  or your friend live");
  const [opponentIndex, setOpponentIndex] = useState(0);
  const [opponentName, setOpponentName] = useState("");
  const [searchingUser, setSearchingUser] = useState(3);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (roomId.length == 10) {
        socket.emit("join-private-room", { roomId, user });
      } else if (roomId.length == 8) {
        socket.emit("join-room", { roomId, user });
      }
      socket.emit("get-room", { roomId });
      return;
    }
  }, [roomId]);

  useEffect(() => {
    socket.on("recieved-data", payload => {
      setOpponentCorrectChar(payload.isCorrect);
      setOpponentIndex(payload.charIndex);
    });
    socket.on("new-person-joined", () => {
      //   console.log(payload);
      console.log("new person joined the game");
      // startGame();
    });
    socket.on("get-room-info", payload => {
      if (payload.playerOne != null && payload.playerTwo != null) {
        // ready and cancel button try kro fir usee bhi ek stage ki trh treate kro
        TODO: if (payload.playerOne._id == user._id) {
          setOpponentName(payload.playerTwo.fullname);
        } else if (payload.playerTwo._id == user._id) {
          setOpponentName(payload.playerOne.fullname);
        }
        if (payload.status == "running") {
          setTimeout(() => {
            startGame();
          }, 2000);
        } else if (payload.status == "playing") {
          setWords(payload.words);
          setSearchingUser(0);
        }
      }
    });
    socket.on("start-game", payload => {
      setWords(payload.str);
      setSearchingUser(2);
    });
    socket.on("play-again", payload => {
      setCorrectChar(Array(charRef.current.length).fill(""));
      setOpponentCorrectChar(Array(charRef.current.length).fill(""));
      setWords(payload.str);
      setSearchingUser(2);
      setCountDown(5);
      setCharIndex(0);
      setOpponentIndex(0);
      setGameEnd(false);
      setMargin(0);
    });
  });
  const sendData = dir => {
    socket.emit("sent-data", {
      charIndex: charIndex + dir,
      name: "unknown",
      roomId,
      isCorrect: correctChar,
    });
  };

  const startGame = () => {
    socket.emit("start-game", { roomId });
  };

  // game

  const inputRef = useRef(null);
  const charRef = useRef([]);

  const [start, setStart] = useState([false, new Date(), 0]);
  const [gameEnd, setGameEnd] = useState(false);

  const [charIndex, setCharIndex] = useState(0);
  const [correctChar, setCorrectChar] = useState([]);
  const [opponentCorrectChar, setOpponentCorrectChar] = useState([]);
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [replacedCharacters, setReplacedCharacters] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const [margin, setMargin] = useState(0);

  let accuracy = charIndex == 0 ? 0 : ((correctCharacters / charIndex) * 100).toFixed(1);
  let wordPerMinute = start[0] == false ? 0 : Math.floor((wordCount / (new Date() - start[1])) * 1000 * 60);
  let length = words.length;

  if (charIndex == length && !gameEnd) {
    // submit
    const resultData = {
      accuracy,
      realAccuracy: (((correctCharacters - replacedCharacters) / charIndex) * 100).toFixed(1),
      wordPerMinute,
      time: Math.floor((new Date() - start[1]) / 1000),
    };
    setGameEnd(true);
    socket.emit("generate-result", { roomId, resultData, userId: user._id });
  }
  useEffect(() => {
    if (!searchingUser) {
      inputRef.current.focus();
      setCorrectChar(Array(charRef.current.length).fill(""));
      setOpponentCorrectChar(Array(charRef.current.length).fill(""));
    }
  }, [searchingUser]);

  const handleInput = e => {
    const characters = charRef.current;
    const currentChar = charRef.current[charIndex];
    const typedChar = e.target.value.slice(-1);
    // console.log(typedChar, " ", currentChar.textContent);
    // console.log(correctChar);
    if (start[0] == false) {
      setStart([true, new Date(), currentChar.offsetTop]);
    }

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      // Handle backspace
      if (charIndex > 0) {
        setCharIndex(charIndex - 1);

        if (correctChar[charIndex - 1] == "incorrect") {
          correctChar[charIndex - 1] = "replaced";
        } else {
          correctChar[charIndex - 1] = ""; // Reset the previous character's class
          setCorrectCharacters(correctCharacters - 1);
        }
        if (charRef.current[charIndex - 1].textContent === " ") {
          setWordCount(wordCount - 1);
        }
        sendData(-1); // minus means prev
      }
    } else if (charIndex < length) {
      // Handle normal character input
      if (typedChar === currentChar.textContent) {
        if (correctChar[charIndex] == "replaced") {
          correctChar[charIndex] = "replacedcorrect";
          setReplacedCharacters(replacedCharacters + 1);
        } else correctChar[charIndex] = "correct";
        setCorrectCharacters(correctCharacters + 1);
      } else {
        correctChar[charIndex] = "incorrect";
      }
      if (currentChar.textContent === " ") {
        setWordCount(wordCount + 1);
      }
      setCharIndex(charIndex + 1);
      sendData(1); // one means next
    }
    console.log(currentChar.offsetTop);
    if (currentChar.offsetTop - start[2] >= 100) {
      setMargin(margin - 96);
    } else if (currentChar.offsetTop - start[2] < 0 && margin < 0) {
      setMargin(margin + 96);
    }
  };
  // let index = 0;
  const [countDown, setCountDown] = useState(5);
  useEffect(() => {
    if (searchingUser != 0 && searchingUser <= 2 && countDown >= 0) {
      const timer = setTimeout(() => {
        setCountDown(countDown - 1);
        if (countDown == 0) {
          setSearchingUser(0);
        }
        if (countDown == 4) {
          setSearchingUser(1);
        }
      }, 1000); // 1000ms = 1 second

      return () => clearTimeout(timer); // Cleanup the timer on unmount or re-render
    }
  }, [countDown, searchingUser]);
  if (searchingUser > 1)
    return (
      <WaitingUser
        displayCode={searchingUser}
        opponentName={opponentName}
        socket={socket}
      />
    );
  return (
    <>
      {searchingUser == 1 && <div className="text-9xl flex fixed z-10 top-1/2 left-1/2 drop-shadow-xl -translate-x-1/2 -translate-y-1/2 ">{countDown}</div>}
      {gameEnd && (
        <div className="flex fixed z-10 top-1/2 left-1/2 drop-shadow-xl -translate-x-1/2 -translate-y-1/2">
          <LiveResult
            socket={socket}
            opponentName={opponentName}
          />
        </div>
      )}
      <div className={`w-full bg-white ${gameEnd || searchingUser == 1 ? "blur-md" : " "}`}>
        <div className="max-w-screen-lg h-12 mx-auto md:px-8 px-2 text-left py-2 ">
          <div className="w-full h-8 text-xl flex justify-between px-2 drop-shadow-xl">
            <div>{user.fullname}</div>
            <div>v/s</div>
            <div>{opponentName}</div>
          </div>
          {/* <div className="w-[8%] h-40 text-lg px-2 pb-3 bg-blue-500 -translate-x-[130%] -translate-y-7 rounded-b-xl flex flex-col-reverse text-white visible xl:invisible">Start Typing</div> */}
        </div>
        <div className="h-60 max-w-screen-lg mx-auto md:px-8 px-2">
          <div className="w-full text-left flex flex-col">
            <input
              type="text"
              className="w-1/2 m-auto translate-y-5"
              ref={inputRef}
              onChange={!gameEnd ? handleInput : null}
            />
            <div
              className="font-mono bg-white rounded-xl drop-shadow-xl  text-gray-500 text-4xl leading-relaxed h-80 px-3 py-2 overflow-clip mt-[-20px]"
              onClick={() => inputRef.current.focus()}
            >
              <div
                className="w-full flex flex-wrap "
                style={{ marginTop: margin }}
              >
                {/* {words.split(" ").map((word, Windex) => {
                  word += " ";
                  return (
                    <span
                      className="flex"
                      key={Windex}
                    >
                      {word.split("").map((letter, Lindex) => {
                        index++;

                        return (
                          <FormatChar
                            letter={letter}
                            key={`${Windex}-${Lindex}`}
                            charRef={charRef}
                            charIndex={charIndex}
                            index={index}
                            opponentIndex={opponentIndex}
                            className={`${charIndex === index ? "border-b-4 border-blue-500" : ""}`}
                            isCorrect={correctChar[charIndex]}
                            isOpponentCorrect={opponentCorrectChar[charIndex]}
                          />
                        );
                      })}
                    </span>
                  );
                })} */}
                {words &&
                  words.split("").map((letter, index) => (
                    <FormatChar
                      letter={letter}
                      key={index}
                      charRef={charRef}
                      index={index}
                      opponentIndex={opponentIndex}
                      className={`${charIndex == index ? "border-blue-500" : "border-transparent"}`}
                      isCorrect={correctChar[index]}
                      isOpponentCorrect={opponentCorrectChar[index]}
                      opponentName={opponentName}
                    />
                  ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="flex flex-col w-full md:w-1/2 lg:w-1/4 text-blue-400">
              <div className="w-full bg-white rounded-xl drop-shadow-xl mt-2 py-2">
                <h1 className="text-2xl">{accuracy}%</h1>Accuracy
              </div>
              <div className="w-full bg-white rounded-xl drop-shadow-xl mt-2 py-2">
                <h1 className="text-2xl">{wordPerMinute}</h1>Speed
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LiveGame;

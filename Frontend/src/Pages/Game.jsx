import React, { useCallback, useEffect, useRef, useState } from "react";
import FormatLetter from "../components/FormatLetter";
import { useNavigate, useParams } from "react-router-dom";
import { allLevels, getLevelContent, submitResult } from "../Api/service";
import { useDispatch, useSelector } from "react-redux";
import Result from "../components/Result";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { setLevelArray } from "../store/userSlice";
function Game() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const { levelNo } = useParams();
  const numberOfLevelsPassed = useSelector(state => state.userData.userData.numberOfLevelsPassed);

  if (levelNo > numberOfLevelsPassed + 1) {
    return <>sorry you are not allowed to access this level. please pass the previous levels</>;
  }

  const [words, setWords] = useState("abcd");
  const levelArray = useSelector(state => state.userData.levelArray);
  const [levelId, setLevelId] = useState(levelArray[levelNo - 1]?.levelId);
  const [levelname, setLevelname] = useState("");
  console.log();

  useEffect(() => {
    if (levelArray.length == 0)
      allLevels()
        .then(response => response.json())
        .then(result => {
          setLevelId(result[levelNo - 1].levelId);
          dispatch(setLevelArray(result));
        });
  }, []);
  const callApi = useCallback(() => {
    getLevelContent(levelId)
      .then(response => response.json())
      .then(result => {
        if (result) {
          setWords(result.levelContent || "err");
          setLevelname(result.levelName || "err");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [levelId]);

  useEffect(() => {
    if (levelNo <= numberOfLevelsPassed + 1) callApi();
  }, [levelId]);

  const inputRef = useRef(null);
  const charRef = useRef([]);

  const [start, setStart] = useState([false, new Date()]);
  const [gameEnd, setGameEnd] = useState(false);

  const [charIndex, setCharIndex] = useState(0);
  const [correctChar, setCorrectChar] = useState([]);
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [replacedCharacters, setReplacedCharacters] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const [margin, setMargin] = useState(0);

  let accuracy = charIndex == 0 ? 0 : ((correctCharacters / charIndex) * 100).toFixed(1);
  let wordPerMinute = start[0] == false ? 0 : Math.floor((wordCount / (new Date() - start[1])) * 1000 * 60);
  let length = words.length;

  if (charIndex == length && !gameEnd) {
    // submit
    setGameEnd(true);
    if (accuracy >= 80 && wordPerMinute >= 10)
      submitResult(levelId, wordPerMinute)
        .then(response => response.json())
        .then(response => {});
  }
  useEffect(() => {
    if (!loading) {
      inputRef.current.focus();
      setCorrectChar(Array(charRef.current.length).fill(""));
    }
  }, [loading]);

  const handleInput = e => {
    if (start[0] == false) {
      setStart([true, new Date()]);
    }
    const characters = charRef.current;
    const currentChar = charRef.current[charIndex];
    const typedChar = e.target.value.slice(-1);
    // console.log(typedChar, " ", currentChar.textContent);
    // console.log(correctChar);

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
    }

    if (currentChar.offsetTop >= 100) {
      setMargin(margin - 60);
    } else if (currentChar.offsetTop < 20 && margin < 0) {
      setMargin(margin + 60);
    }
  };

  return (
    <>
      {gameEnd && (
        <div className="flex fixed z-10 top-1/2 left-1/2 drop-shadow-xl -translate-x-1/2 -translate-y-1/2">
          <Result
            fail={accuracy < 80 ? 1 : wordPerMinute < 10 ? 2 : 0}
            data={{
              accuracy,
              realAccuracy: (((correctCharacters - replacedCharacters) / charIndex) * 100).toFixed(1),
              wordPerMinute,
              time: Math.floor((new Date() - start[1]) / 1000),
              levelNo,
            }}
          />
        </div>
      )}
      <div className={`w-full bg-white ${gameEnd ? "blur-sm" : " "}`}>
        <div className="w-4/5 h-10 mx-auto text-left  py-2">
          <div className="w-full h-5 text-xl font-thin">
            Level {levelNo} : {levelname}{" "}
          </div>
          <div className="w-[8%] h-40 text-lg px-2 pb-3 bg-blue-500 -translate-x-[130%] -translate-y-7 rounded-b-xl flex flex-col-reverse text-white ">Start Typing</div>
        </div>
        <div className="h-60 w-4/5 mx-auto">
          <div className="w-full text-left flex flex-col">
            <input
              type="text"
              className="w-1/2 m-auto"
              ref={inputRef}
              onChange={!gameEnd ? handleInput : null}
            />
            <div
              className="font-mono bg-white rounded-xl drop-shadow-xl  text-gray-500 text-4xl leading-relaxed h-52 px-3 py-5 overflow-clip mt-[-30px]"
              onClick={() => inputRef.current.focus()}
            >
              <div
                className="w-full "
                style={{ marginTop: margin }}
              >
                {words &&
                  words.split("").map((letter, index) => (
                    <FormatLetter
                      letter={letter}
                      key={index}
                      charRef={charRef}
                      index={index}
                      className={`${charIndex == index ? "border-b-4 border-blue-500" : ""}`}
                      isCorrect={correctChar[index]}
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

export default Game;

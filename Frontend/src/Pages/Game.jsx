import React, { useCallback, useEffect, useRef, useState } from "react";
import FormatLetter from "../components/FormatLetter";
import { useParams } from "react-router-dom";
import { getLevelContent, submitResult } from "../Api/service";
function Game() {
  const { levelId } = useParams();
  const [words, setWords] = useState("abcd");

  const callApi = useCallback(() => {
    getLevelContent(levelId)
      .then(response => response.json())
      .then(result => setWords(result.levelContent));
  });

  useEffect(() => {
    callApi();
  }, []);

  const inputRef = useRef(null);
  const charRef = useRef([]);

  const [start, setStart] = useState([false, new Date()]);

  const [charIndex, setCharIndex] = useState(0);
  const [correctChar, setCorrectChar] = useState([]);
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  let accuracy = charIndex == 0 ? 0 : ((correctCharacters / charIndex) * 100).toFixed(1);
  let wordPerMinute = Math.floor((wordCount / (new Date() - start[1])) * 1000 * 60);
  let time = start[0] ? Math.floor((new Date() - start[1]) / 1000) : 0;
  let length = words.length;

  useEffect(() => {
    inputRef.current.focus();
    setCorrectChar(Array(charRef.current.length).fill(""));
  }, []);

  const handleInput = e => {
    if (start[0] == false) {
      setStart([true, new Date()]);
    }
    const characters = charRef.current;
    const currentChar = charRef.current[charIndex];
    const typedChar = e.target.value.slice(-1);
    // console.log(typedChar, " ", currentChar.textContent);

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      // Handle backspace
      if (charIndex > 0) {
        setCharIndex(charIndex - 1);
        correctChar[charIndex - 1] = ""; // Reset the previous character's class
        if (charRef.current[charIndex - 1].textContent === " ") {
          setWordCount(wordCount - 1);
        }
      }
    } else if (charIndex < length) {
      // Handle normal character input
      if (typedChar === currentChar.textContent) {
        correctChar[charIndex] = "text-green-700 bg-green-200";
        setCorrectCharacters(correctCharacters + 1);
      } else {
        correctChar[charIndex] = "text-red-700 bg-red-200";
      }
      if (currentChar.textContent === " ") {
        setWordCount(wordCount + 1);
      }
      setCharIndex(charIndex + 1);
    } else {
      // submit
      console.log("end");
      submitResult(levelId, wordPerMinute)
        .then(response => response.json())
        .then(response => {
          console.log(response);
        });
    }
  };

  return (
    <>
      <div className="w-full bg-white">
        <div className="w-4/5 mx-auto text-left">{time}sec</div>
        <div className="h-52 w-4/5 mx-auto">
          <div className="w-full text-left flex flex-col ">
            <input
              type="text"
              className=""
              ref={inputRef}
              onChange={handleInput}
            />
            <div className="font-mono bg-white rounded-xl drop-shadow-xl  text-gray-500 text-3xl leading-relaxed h-52 p-3 overflow-clip">
              {words &&
                words.split("").map((letter, index) => (
                  <FormatLetter
                    letter={letter}
                    key={index}
                    charRef={charRef}
                    index={index}
                    className={`${charIndex == index ? "border-b-4 border-blue-500" : ""} ${correctChar[index]}`}
                  />
                ))}
            </div>
          </div>

          <div className="flex justify-end">
            <div className="flex flex-col w-full md:w-1/2 lg:w-1/4 text-blue-400">
              <div className="w-full bg-white rounded-xl drop-shadow-xl mt-2">
                <h1>{accuracy}%</h1>Accuracy
              </div>
              <div className="w-full bg-white rounded-xl drop-shadow-xl mt-2">
                <h1>{wordPerMinute}</h1>Words per Minute
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Game;

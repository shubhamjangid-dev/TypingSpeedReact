import React from "react";
import { ChevronDown } from "lucide-react";
function FormatChar({ letter, charRef, index, className, isCorrect, opponentIndex, isOpponentCorrect, opponentName }) {
  const classes = {
    correct: "bg-green-200 text-green-700",
    incorrect: "bg-red-200 text-red-700",
    replacedcorrect: "bg-yellow-200 text-yellow-700",
  };
  return (
    <span
      className={`flex flex-col w-6 h-17 mx-0.5 my-2 ${className} rounded-sm`}
      ref={e => (charRef.current[index] = e)}
    >
      <span className={`w-6 h-6 flex text-[5px] z-10 rounded-full mb-2 ${classes[isOpponentCorrect]} ${opponentIndex == index ? "bg-gray-300" : ""}`}>
        {opponentIndex == index && (
          <>
            <span className="w-6 h-6">
              <ChevronDown className="pt-[2px]" />
            </span>
            <h1 className="text-[14px] pl-2">{opponentName}</h1>
          </>
        )}
      </span>

      <span className={`letter h-11 rounded-sm p-0.5 ${classes[isCorrect]} flex items-center`}>{letter}</span>
    </span>
  );
}

export default FormatChar;

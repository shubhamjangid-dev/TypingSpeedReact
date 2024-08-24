import React from "react";
import { ChevronDown } from "lucide-react";
function FormatChar({ letter, charRef, index, className, isCorrect, opponentIndex, isOpponentCorrect }) {
  const classes = {
    correct: "bg-green-200 text-green-700",
    incorrect: "bg-red-200 text-red-700",
    replacedcorrect: "bg-yellow-200 text-yellow-700",
  };
  return (
    <div
      className={`flex flex-col w-6 h-17 mx-0.5 my-2 ${className} rounded-sm`}
      ref={e => (charRef.current[index] = e)}
    >
      <div className={`w-6 h-6 flex text-[5px] z-10 rounded-full mb-2 ${classes[isOpponentCorrect]} ${opponentIndex == index ? "bg-gray-300" : ""}`}>
        {opponentIndex == index && (
          <>
            <ChevronDown className="pt-[2px]" />
          </>
        )}
      </div>

      <span className={`letter h-11 rounded-sm p-0.5 ${classes[isCorrect]} flex items-center`}>{letter}</span>
    </div>
  );
}

export default FormatChar;

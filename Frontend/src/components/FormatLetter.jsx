import React from "react";

function FormatLetter({ letter, charRef, index, className, isCorrect }) {
  const classes = {
    correct: "bg-green-200 text-green-700",
    incorrect: "bg-red-200 text-red-700",
    replacedcorrect: "bg-yellow-200 text-yellow-700",
  };
  return (
    <span
      className={`letter mx-0.5 rounded-sm p-0.5 ${className} ${classes[isCorrect]}`}
      ref={e => (charRef.current[index] = e)}
    >
      {letter}
    </span>
  );
}

export default FormatLetter;

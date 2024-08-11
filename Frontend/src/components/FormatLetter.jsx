import React from "react";

function FormatLetter({ letter, charRef, index, className }) {
  return (
    <span
      className={`letter mx-0.5 rounded-sm p-0.5 ${className}`}
      ref={e => (charRef.current[index] = e)}
    >
      {letter}
    </span>
  );
}

export default FormatLetter;

import React, { useState, useEffect, useRef } from "react";
import { UserRound } from "lucide-react";
import { useParams } from "react-router-dom";
function WaitingUser() {
  const { roomId } = useParams();
  console.log(roomId);
  const [link, setLink] = useState("http://localhost:5173/live/" + roomId);
  const [isCopied, setIsCopied] = useState(false);

  const linkRef = useRef(null);
  const copyToClipBoard = () => {
    linkRef.current?.select();
    window.navigator.clipboard.writeText(password);
    setIsCopied(true);
  };
  if (roomId.length == 10) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <div className="bg-blue-100 rounded-full p-4 animate-rotateY-anim mb-3">
          <UserRound size={100} />
        </div>
        <h1 className="text-lg my-3">Waiting for your friend</h1>
        <div className="max-w-[300px] flex justify-between border-gray-300 border-2 rounded-md">
          <input
            type="text"
            className="w-full h-6 rounded-md outline-none text-gray-500"
            value={link}
            readOnly
            ref={linkRef}
          />
          <button
            onClick={copyToClipBoard}
            className="bg-yellow-500 px-2 rounded-sm"
          >
            {isCopied ? "copied" : "copy"}
          </button>
        </div>
        <h1 className="text-lg mt-3">share this link to your friend</h1>
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <div className="bg-blue-100 rounded-full p-4 animate-rotateY-anim">
        <UserRound size={100} />
      </div>
      <h1 className="text-lg mt-3">Waiting for another User...</h1>
    </div>
  );
}

export default WaitingUser;

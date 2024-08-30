import React, { useState, useEffect, useRef } from "react";
import { UserRound } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
function WaitingUser({ displayCode, opponentName, socket }) {
  // displaycode  3 -> searching
  //              2 -> found and confirmation
  //              1 -> countDown

  const { roomId } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState("typingzone.shubhamjangir.in/live/" + roomId);
  const [isCopied, setIsCopied] = useState(false);
  const user = useSelector(state => state.userData.userData);

  const linkRef = useRef(null);
  const copyToClipBoard = () => {
    linkRef.current?.select();
    window.navigator.clipboard.writeText(link);
    setIsCopied(true);
  };
  if (roomId.length == 10) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <div className={`bg-blue-100 rounded-full p-4 transition-transform duration-300 ease-in ${displayCode == 3 ? "animate-rotateY-anim" : "scale-125"}`}>
          <UserRound size={100} />
        </div>
        <h1 className="text-lg my-5">{displayCode == 2 ? opponentName : "searching..."}</h1>
        <h1 className="text-lg my-5">
          {displayCode == 3 && "Waiting for your friend..."}
          {displayCode == 2 && "starting the game"}
        </h1>
        {displayCode == 3 && (
          <>
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
            <button
              className="bg-red-500  text-white px-4 py-1 rounded-sm mt-3 "
              onClick={() => {
                navigate("/live");
                //TODO:  delete the room
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center ">
      <div className={`bg-blue-100 rounded-full p-4 transition-transform duration-300 ease-in ${displayCode == 3 ? "animate-rotateY-anim" : "scale-125"}`}>
        <UserRound size={100} />
      </div>
      <h1 className="text-lg my-5">{displayCode == 2 ? opponentName : "searching..."}</h1>
      <h1 className="text-lg my-5">
        {displayCode == 3 && "Waiting for another User..."}
        {displayCode == 2 && "starting the game"}
      </h1>
      {displayCode == 3 && (
        <button
          className="bg-red-500  text-white px-4 py-1 rounded-sm mt-2 "
          onClick={() => {
            socket.emit("exit-room", { roomId, user });
            navigate("/live");
            //TODO:  delete the room
          }}
        >
          Cancel
        </button>
      )}
    </div>
  );
}

export default WaitingUser;

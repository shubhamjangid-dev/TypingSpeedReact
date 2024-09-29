import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function LiveResult({ socket, opponentName }) {
  const [opponentResult, setOpponentResult] = useState(null);
  const [message, setMessage] = useState("");
  const [userResult, setUserResult] = useState(null);
  const user = useSelector(state => state.userData.userData);
  const { roomId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("finish-game", payload => {
      if (user._id == payload.playerOne._id) {
        setOpponentResult(payload.playerTwoResult);
        setUserResult(payload.playerOneResult);
      } else if (user._id == payload.playerTwo._id) {
        setOpponentResult(payload.playerOneResult);
        setUserResult(payload.playerTwoResult);
      }
    });
    socket.on("message", payload => {
      setMessage(payload);
    });
  });
  return (
    <div className="w-[520px] lg:w-[768px] h-[440px] bg-white rounded-2xl flex flex-col p-4">
      <div className="text-3xl py-10 px-10 ">Waiting for opponent to complete</div>
      <div className="w-full flex justify-between text-2xl">
        <span className="w-1/5 text-xl text-center overflow-hidden">{user.fullname}</span>
        <span className="w-1/5 text-xl text-center overflow-hidden">{opponentName}</span>
      </div>
      <div className="w-full flex justify-between text-2xl">
        <div className="w-1/5 h-full flex flex-col justify-center bg-slate-100 py-2 rounded-xl">
          <span className="">{userResult?.wordPerMinute}</span>
          <span className="">{userResult?.accuracy}</span>
          <span className="">{userResult?.time}</span>
        </div>
        <div className="w-2/5 h-full flex flex-col justify-center text-center  py-2">
          <span className="">words per Minute</span>
          <span className="">Accuracy</span>
          <span className="">time</span>
        </div>
        <div className="w-1/5 h-full flex flex-col justify-center bg-slate-100 py-2 rounded-xl">
          {opponentResult != null ? (
            <>
              <span>{opponentResult.wordPerMinute}</span>
              <span>{opponentResult.accuracy}</span>
              <span>{opponentResult.time}</span>
            </>
          ) : (
            <div>waiting for {opponentName} to complete</div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-around">
        <button
          className="w-full m-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
          onClick={() => {
            socket.emit("exit-room", { roomId, user });
            navigate("/live");
          }}
        >
          Exit
        </button>
        <button
          className={`w-full m-6 bg-blue-500 ${opponentResult == null ? "bg-blue-400" : "hover:bg-blue-600"} text-white font-bold py-3 px-6 rounded-lg`}
          disabled={opponentResult == null}
          onClick={() => {
            socket.emit("play-again", { roomId, userId: user._id });
          }}
        >
          play again
        </button>
      </div>
      {message && <div className="">{message}</div>}
    </div>
  );
}

export default LiveResult;

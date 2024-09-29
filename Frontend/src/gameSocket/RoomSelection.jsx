import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function RoomSelection({ socket }) {
  const navigate = useNavigate();
  const user = useSelector(state => state.userData.userData);
  useEffect(() => {
    socket.on("new-game-person", payload => {
      if (payload.socketId == socket.id) {
        navigate(`/live/${payload.roomId}`);
      }
    });
  });
  return (
    <div className="w-full">
      <div className="max-w-screen-lg min-h-screen mx-auto p-5">
        <div className="w-full flex flex-col justify-between ">
          <div className="px-2 font-bold text-3xl text-center text-gray-800">Join a Room</div>
          <div className="flex justify-between items-center flex-col sm:flex-row">
            <button
              className="w-52 px-3 py-1 m-4 text-xl text-white bg-green-500 border-2 border-green-500 rounded-md"
              onClick={() => {
                socket.emit("create-room", user);
                // console.log(socket.id);
              }}
            >
              creat private room
            </button>
            <button
              className="w-52 px-3 py-1 m-4 text-xl text-white bg-green-500 border-2 border-green-500 rounded-md"
              onClick={() => {
                socket.emit("join-unknown-room", user);
              }}
            >
              join random room
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col"></div>
      </div>
    </div>
  );
}

export default RoomSelection;

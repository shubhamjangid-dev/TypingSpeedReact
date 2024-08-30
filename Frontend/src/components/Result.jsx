import React from "react";
import Congratulations from "../assets/Congratulations.jpg";
import BetterLuckNextTime from "../assets/BetterLuckNextTime.jpeg";
import { useNavigate } from "react-router-dom";

function Result({ fail, data }) {
  const navigate = useNavigate();
  return (
    <div className="min-w-lg h-[470px] bg-white rounded-2xl">
      <div className="w-full text-5xl font-bold flex justify-center">
        <img
          src={fail ? BetterLuckNextTime : Congratulations}
          alt={`${fail} ?"BetterLuckNextTime" : "Congratulations" `}
          width={500}
          className="rounded-2xl"
        />
      </div>
      <div className="w-full flex mb-10 mx-auto justify-evenly text-black/70">
        <div className="w-40 h-40 border-2 border-[#c6a061] rounded-full">
          <div className="w-full h-full border-[12px] border-[#c6a061]/40 rounded-full flex flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold">{data.accuracy}</h1>
            <h1 className="text-2xl opacity-40">real {data.realAccuracy}%</h1>
          </div>
          <h1 className="text-xl my-2">Accuracy</h1>
        </div>
        <div className="w-32 h-32 border-2 border-[#c6a061] rounded-full border-dotted">
          <div className="w-full h-full border-[12px] border-[#c6a061]/40 rounded-full flex flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold">{data.time}</h1>
            <h1 className="text-2xl opacity-40">sec</h1>
          </div>
          <h1 className="text-xl my-2">Duration</h1>
        </div>
        <div className="w-40 h-40 border-2 border-[#c6a061] rounded-full">
          <div className="w-full h-full border-[12px] border-[#c6a061]/40 rounded-full flex flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold">{data.wordPerMinute}</h1>
            <h1 className="text-2xl opacity-40">wpm</h1>
          </div>
          <h1 className="text-xl my-2">Speed</h1>
        </div>
      </div>
      <div className="w-full bg-white rounded-b-2xl flex justify-around py-4 border-t-2 border-[#c6a061]/30">
        <div className="w-32 px-3">
          <button
            className={`${!fail ? "bg-gray-400 hover:bg-gray-500" : "bg-[#c6a061]/60 hover:bg-[#c6a061]/80"} w-full  rounded-full px-2 text-white`}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
        <h1 className="text-gray-500 text-sm">
          {`${!fail ? "Excellent work! Time to move on to the next lesson" : fail == 1 ? "Minimum accuracy 80%. Aim for 100% next time." : "Boost speed. Type faster than required WPM to pass."}`}.
        </h1>
        <div className="w-32 px-3">
          <button
            className={`${fail ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} w-full rounded-full px-2 text-white`}
            onClick={() => {
              navigate(`/level/${1 + parseInt(data.levelNo)}`);
              window.location.reload();
            }}
            disabled={fail}
          >
            next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;

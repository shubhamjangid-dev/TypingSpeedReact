import React from "react";
import keyboardImage from "../assets/keyboard.jpg";
import Icon from "./Icon";
import { useNavigate } from "react-router-dom";

function LevelCard({ levelData, levelNo, locked }) {
  const navigate = useNavigate();

  return (
    <div
      className={`${locked ? "bg-gray-100" : "bg-white"} m-2 drop-shadow-lg rounded-xl h-52 ${!locked ? "hover:scale-110 transition ease-out duration-300 " : "cursor-not-allowed"}`}
      onClick={() => {
        // console.log(levelData.levelId);

        if (!locked) navigate(`/level/${levelNo}`);
      }}
    >
      <div className="w-full h-12 flex justify-between pt-1 ">
        <div className="text-4xl w-10 font-bold text-gray-600 px-2">{levelNo}</div>
        {locked || (
          <div className="translate-y-3 text-gray-600">
            <h1 className="text-2xl font-bold">{levelData.score}</h1>score
          </div>
        )}
        <div className="w-10 pt-1">{locked && <Icon name="lock" />}</div>
      </div>
      <div className="w-full px-4">
        {locked ? (
          <img
            className="h-32 m-auto"
            src={keyboardImage}
            alt="Hands typing on keyboard"
          />
        ) : (
          <Icon name="box" />
        )}
      </div>
      <div className="text-md border-t-[1px] border-gray-800 py-1">{levelData.levelName}</div>
      {locked || levelData.score == 0 || (
        <div className="h-10 w-10 mx-auto -translate-y-20 bg-white rounded-full">
          <Icon name="check" />
        </div>
      )}
    </div>
  );
}

export default LevelCard;

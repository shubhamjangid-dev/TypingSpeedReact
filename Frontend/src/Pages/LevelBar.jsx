import React, { useEffect, useState } from "react";
import LevelCard from "../components/LevelCard";
import { allLevels } from "../Api/service";
import { useDispatch, useSelector } from "react-redux";
import { setLevelArray } from "../store/userSlice";
import Loader from "../components/Loader";

function LevelBar() {
  const [allLevelData, setAllLevelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.userData.userData);
  const dispatch = useDispatch();
  useEffect(() => {
    allLevels()
      .then(response => response.json())
      .then(result => {
        setAllLevelData(result);
        dispatch(setLevelArray(result));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  // console.log("123 ", allLevelData);

  return loading ? (
    <>
      <div className="w-full min-h-screen">
        <div className="max-w-screen-lg px-2 md:px-8 mx-auto text-left">
          <div className="w-full h-10 py-2 my-3 bg-black/5 rounded-xl text-gray-700 animate-pulse"></div>
        </div>

        <div className="max-w-screen-lg px-2 md:px-8 mx-auto">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="w-full h-52 bg-gray-300 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="w-full min-h-screen">
      <div className="max-w-screen-lg px-2 md:px-8 mx-auto text-left ">
        <div className="w-full py-2 my-3 bg-black/5 rounded-xl text-gray-700 ">
          <div className="flex flex-1 justify-evenly px-5">
            <p className="pr-[5%]">
              <b>{Math.floor((user.numberOfLevelsPassed / allLevelData.length) * 100)}%</b> progress
            </p>
            <div className=" min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-100"></div>
            <p className="px-[5%]">
              <b>
                {user.numberOfLevelsPassed} / {allLevelData.length}
              </b>{" "}
              levels passed
            </p>
            <div className=" min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-100"></div>
            <p className="pl-[5%]">
              <b>{user.totalScore}</b> score
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-screen-lg px-2 md:px-8 mx-auto">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {allLevelData &&
            allLevelData.map((level, index) => (
              <LevelCard
                key={index}
                levelNo={index + 1}
                locked={!level.levelPassed}
                levelData={level}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default LevelBar;

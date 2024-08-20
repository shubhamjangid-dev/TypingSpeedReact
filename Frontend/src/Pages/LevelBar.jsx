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
      <Loader />
    </>
  ) : (
    <div className="bg-blue-200">
      <div className="md:w-3/4 w-full px-[5%] text-left ">
        <div className="w-full px-5 py-3">
          <div className="px-2 py-2 bg-white/20 rounded-xl text-gray-700">
            <div className="flex flex-1">
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
      </div>
      <div className="md:w-3/4 w-full px-[5%]">
        <div className="w-full px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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

import React, { useEffect, useState } from "react";
import LevelCard from "../components/LevelCard";
import { allLevels } from "../Api/service";
import { useDispatch } from "react-redux";
import { setLevelArray } from "../store/userSlice";

function LevelBar() {
  const [allLevelData, setAllLevelData] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    allLevels()
      .then(response => response.json())
      .then(result => {
        setAllLevelData(result);
        dispatch(setLevelArray(result));
      });
  }, []);
  console.log("123 ", allLevelData);

  return (
    <div className="bg-blue-200">
      <div className="md:w-3/4 w-full px-[5%] text-left">
        <div className="px-10"> 50% progress | </div>
      </div>
      <div className="md:w-3/4 w-full px-[5%]">
        <div className="w-full px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

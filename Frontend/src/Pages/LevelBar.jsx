import React, { useEffect, useState } from "react";
import LevelCard from "../components/LevelCard";
import { allLevels } from "../Api/service";

function LevelBar() {
  const [allLevelData, setAllLevelData] = useState([]);
  useEffect(() => {
    allLevels()
      .then(response => response.json())
      .then(result => setAllLevelData(result));
  }, []);
  console.log("123 ", allLevelData);

  return (
    <div className="md:w-3/4 w-full">
      <div className="w-full p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
  );
}

export default LevelBar;

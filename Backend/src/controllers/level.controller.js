import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { LevelAchieved } from "../model/levelAchieved.model.js";
import { Level } from "../model/levels.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const addNewLevel = asyncHandler(async (req, res) => {
  const { levelName, levelContent } = req.body;
  if (levelName.trim() === "") {
    throw new ApiError(400, "Enter valid levelname");
  }
  if (levelContent.trim() === "") {
    throw new ApiError(400, "Enter valid content of level");
  }

  const levelExist = await Level.findOne({
    $or: [{ levelName }, { levelContent }],
  });
  if (levelExist) {
    throw new ApiError(409, "Level already exist");
  }

  const level = await Level.create({
    levelName,
    levelContent: levelContent.toLowerCase(),
  });

  const createdLevel = await Level.findById(level._id);

  if (!createdLevel) {
    throw new ApiError(500, "Somthing went wrong while uploading level data to database");
  }

  res.status(201).json(new ApiResponse(200, createdLevel, "New Level Added Successfully"));
});

const getAllLevels = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // console.log(typeof userId);
  try {
    const levels = await Level.aggregate([
      {
        $lookup: {
          from: "levelachieveds", // Make sure this matches the collection name in your MongoDB
          let: { levelId: "$_id", userId: new mongoose.Types.ObjectId(userId) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$level", "$$levelId"] }, { $eq: ["$user", "$$userId"] }],
                },
              },
            },
          ],
          as: "achieved",
        },
      },
      {
        $project: {
          levelId: "$_id",
          levelName: "$levelName",
          levelPassed: { $gt: [{ $size: "$achieved" }, 0] },
          score: { $arrayElemAt: ["$achieved.score", 0] },
        },
      },
    ]);

    let isFirstLevelUnlocked = false;
    const result = levels.map((level, index) => {
      if (level.levelPassed == false && !isFirstLevelUnlocked) {
        isFirstLevelUnlocked = true;
        return {
          levelId: level.levelId,
          levelName: level.levelName,
          levelPassed: true,
          score: level.score || 0,
        };
      }
      return {
        levelId: level.levelId,
        levelName: level.levelName,
        levelPassed: level.levelPassed,
        score: level.score || 0,
      };
    });
    // console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching user levels");
  }
});

const getLevelContent = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { id } = req.body;
  // console.log(id);
  try {
    const levels = await Level.findById(id);
    //   console.log("levels ",levels);
    res.json(levels);
  } catch (err) {
    console.error("Error retrieving level:", err);
    res.status(500).send("Error retrieving level");
  }
});

export { addNewLevel, getAllLevels, getLevelContent };

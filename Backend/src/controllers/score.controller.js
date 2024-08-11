import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Level } from "../model/levels.model.js";
import { User } from "../model/user.model.js";
import { LevelAchieved } from "../model/levelAchieved.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const submitResult = asyncHandler(async (req, res) => {
  const { levelId, score } = req.body;
  const id = req.user._id;
  if (!score) {
    throw new ApiError(400, "Could'n get score");
  }

  const levelExist = await Level.findById(levelId);
  if (!levelExist) {
    throw new ApiError(409, "Level not found");
  }

  const userExist = await User.findById(id);
  if (!userExist) {
    throw new ApiError(409, "User not found");
  }

  // if level is already completed
  const resultExist = await LevelAchieved.findOne({
    level: levelExist._id,
    user: userExist._id,
  });
  if (resultExist != null) {
    const storedResult = await LevelAchieved.findByIdAndUpdate(
      resultExist._id,
      {
        $set: {
          score: score,
        },
      },
      {
        new: true,
      }
    );
    res.status(201).json(new ApiResponse(200, storedResult, "Result Updated Successfully"));
  } else {
    const levelAchieved = await LevelAchieved.create({
      level: levelExist._id,
      user: userExist._id,
      score,
    });

    const createdResult = await LevelAchieved.findById(levelAchieved._id);

    if (!createdResult) {
      throw new ApiError(500, "Somthing went wrong while submitting score data to database");
    }

    res.status(201).json(new ApiResponse(200, createdResult, "Result Submitted Successfully"));
  }
});

export { submitResult };

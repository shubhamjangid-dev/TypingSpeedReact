import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    console.log("body", req.body);
    const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "") || req.body?.accessToken;
    if (!token) {
      throw new ApiError(401, "Not authorized to access this route");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      throw new ApiError(401, "Invalid access token or expired");
    }
    console.log("dtoken", decodedToken);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});

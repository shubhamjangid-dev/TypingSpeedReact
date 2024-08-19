import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import { LevelAchieved } from "../model/levelAchieved.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async userId => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    // console.log("AccessToken",accessToken);
    const refreshToken = user.generateRefreshToken();
    // console.log("refreshToken",refreshToken);

    user.refreshTokens = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //     message : "ok : user is registered"
  // })

  // Register User Steps ->

  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullname, email, username, password } = req.body;
  // console.log(req.body);
  if (fullname.trim() === "") {
    throw new ApiError(400, "Enter valid name");
  }
  if (email.trim() === "" || !email.trim().includes("@")) {
    throw new ApiError(400, "Enter valid email");
  }
  if (username.trim() === "") {
    throw new ApiError(400, "Enter valid username");
  }
  if (password.trim() === "") {
    throw new ApiError(400, "Enter valid password");
  }

  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (userExist) {
    throw new ApiError(409, "User already exist");
  }

  const userdata = await User.create({
    fullname,
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(userdata._id).select("-password -refreshTokens");

  if (!createdUser) {
    throw new ApiError(500, "Somthing went wrong while uploading data to database");
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(createdUser._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: createdUser,
          accessToken,
          refreshToken,
        },
        "User Register & Logged In Successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  // req.body ->data
  // username, email, password
  // find user -> not found send user not found
  // check passsword
  // access and refresh token
  // send cookie
  const { email, username, password } = req.body;
  // console.log(username, email, password);
  if (!email && !username) {
    throw new ApiError(400, "username or password required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshTokens");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // console.log(req.user._id);
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incommingRefreshToken = req.cookie?.refreshToken || req.body?.refreshToken;
    if (!incommingRefreshToken) {
      throw new ApiError(401, "Refresh Token not found");
    }

    const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incommingRefreshToken !== user?.refreshTokens) {
      throw new ApiError(401, "Refresh Token is Expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const option = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
            user,
          },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Error invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // agr vo password change kr raha h to mtlb vo logged h
  // to req me user bhi hoga
  // console.log(req.body);
  if (newPassword != confirmPassword) {
    throw new ApiError(401, "New password & Confirm password is not same");
  }

  const user = await User.findById(req.user?._id);

  const isCorrectPassword = await user.isPasswordCorrect(oldPassword);

  if (!isCorrectPassword) {
    throw new ApiError(401, "Invalid Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // console.log(req.user);
  return res.status(200).json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  // console.log(req.body);

  const { fullname, email, username } = req.body;

  if (!fullname || !email || !username) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
        username,
      },
    },
    {
      new: true,
    }
  ).select("-password ");

  return res.status(200).json(new ApiResponse(200, user, "User details updated successfully"));
});

const getUserRank = asyncHandler(async (req, res) => {
  const rank = await User.countDocuments({ totalScore: { $gt: req.user?.totalScore } });
  console.log("123", rank);

  return res.status(200).json(rank);
});

const deleteAccount = asyncHandler(async (req, res) => {
  const id = req.user?._id;
  const deletedUser = await User.deleteOne({ _id: id });
  const deletedLevels = await LevelAchieved.deleteMany({ user: id });

  return res.status(200).json(new ApiResponse(200, {}, "Account deleted successfully"));
});

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateUserDetails, getUserRank, deleteAccount };

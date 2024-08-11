import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser, getUserLevelBoard } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser); // tabhi middleware me next hota h kyuki verifyJwt ke ke baad next walle pe jana h
router.route("/refresh-token").post(refreshAccessToken);
router.route("/currentuser").post(verifyJWT, getCurrentUser);
router.route("/getUserLevelBoard").post(verifyJWT, getUserLevelBoard);

export default router;

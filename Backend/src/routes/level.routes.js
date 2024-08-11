import { Router } from "express";
import { addNewLevel, getAllLevels, getLevelContent } from "../controllers/level.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/addNewLevel").post(addNewLevel);

router.route("/getAllLevels").post(verifyJWT, getAllLevels);

router.route("/getLevelContent").post(getLevelContent);

export default router;

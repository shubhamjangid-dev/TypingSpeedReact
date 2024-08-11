import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { submitResult } from "../controllers/score.controller.js";

const router = Router();

router.route("/submit").post(verifyJWT,submitResult);

export default router;
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // limit lga rahe ki server pe isse jayda load na aaye
app.use(urlencoded({ extended: true, limit: "16kb" })); // url ko uncode krta h // ex- %20 mtlb=> space
app.use(express.static("public"));
app.use(cookieParser());

// Routes Import
import userRouter from "./routes/user.routes.js";
import levelRouter from "./routes/level.routes.js";
import scoreRouter from "./routes/score.routes.js";

// Routes Declaration
// ex : http:localhost:4000/api/v1/users/register to ye prefix match krega
// ex : http:localhost:4000/api/v1/users/login to login or register user sirg routes me hi honge

app.use("/api/v1/users", userRouter); // User Related
app.use("/api/v1/levels", levelRouter); // Level Related
app.use("/api/v1/score", scoreRouter); // Score Related

// app is ecported to use in index.js file
export { app };

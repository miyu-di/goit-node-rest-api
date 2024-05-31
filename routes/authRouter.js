import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  loginSchemas,
  registerSchemas,
  resendSchemas,
} from "../schemas/usersSchemas.js";
import {
  currentUser,
  login,
  logout,
  register,
  resendVerify,
  uploadAvatar,
  verify,
} from "../controllers/usersControllers.js";
import { tokenValidation } from "../middleware/tokenValidation.js";
import uploadMiddleware from "../middleware/upload.js";

const userRouter = express.Router();

userRouter.post("/register", validateBody(registerSchemas), register);

userRouter.post("/login", validateBody(loginSchemas), login);

userRouter.post("/logout", tokenValidation, logout);

userRouter.get("/current", tokenValidation, currentUser);

userRouter.patch(
  "/avatars",
  tokenValidation,
  uploadMiddleware.single("avatar"),
  uploadAvatar
);

userRouter.get("/verify/:verificationToken", verify);

userRouter.post("/verify", validateBody(resendSchemas), resendVerify);

export default userRouter;

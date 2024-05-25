import express from "express";
import validateBody from "../helpers/validateBody.js";
import { loginSchemas, registerSchemas } from "../schemas/usersSchemas.js";
import { currentUser, login, logout, register } from "../controllers/usersControllers.js";
import { tokenValidation } from "../middleware/tokenValidation.js";

const userRouter = express.Router();

userRouter.post("/register", validateBody(registerSchemas), register);

userRouter.post("/login", validateBody(loginSchemas), login);

userRouter.post("/logout", tokenValidation, logout);

userRouter.get("/current", tokenValidation, currentUser);

export default userRouter
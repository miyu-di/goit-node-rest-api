import HttpError from "../helpers/HttpError.js";
import usersServices from "../services/usersServices.js";
import gravatar from "gravatar";
import * as fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await usersServices.getUserByEmail({
      email: email,
    });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email, {
      protocol: "http",
      s: "100",
    });

    const createdUser = await usersServices.createUser({
      email: email,
      password: passwordHash,
      avatarURL,
    });
    res.status(201).json({
      user: {
        email: createdUser.email,
        subscription: createdUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await usersServices.getUserByEmail({
      email: email,
    });

    if (user === null) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.SECRET,
      {
        expiresIn: "7d",
      }
    );

    await usersServices.updateUser(user._id, { token });

    res.status(200).json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await usersServices.updateUser(req.user.id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const currentUser = (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({
      email: email,
      subscription: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const user = await usersServices.updateUser(req.user.id, {
      avatar: req.file.filename,
    });

    res.status(200).send({ avatarURL: user.avatar });
  } catch (error) {
    next(error);
  }
};

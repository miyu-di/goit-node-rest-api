import HttpError from "../helpers/HttpError.js";
import usersServices from "../services/usersServices.js";
import gravatar from "gravatar";
import * as fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Jimp from "jimp";
import crypto from "node:crypto";
import sendMail from "../helpers/mail.js";

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
    const verificationToken = crypto.randomUUID();

    const avatarURL = gravatar.url(email, {
      protocol: "http",
      s: "100",
    });

    const createdUser = await usersServices.createUser({
      email: email,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });

    await sendMail({
      to: createdUser.email,
      from: "dianka211205@gmail.com",
      subject: "Welcome to Contacbook!",
      html: `To confirm your email, please, click on the <a href="http://localhost:5500/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your email, please, open the link http://localhost:5500/users/verify/${verificationToken}`,
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

export const verify = async (req, res, next) => {
  try {
    const user = await usersServices.getOneUser({
      verificationToken: req.params.verificationToken,
    });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    await usersServices.updateUser(user.id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).send("Verification successful");
  } catch (error) {
    next(error);
  }
};

export const resendVerify = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await usersServices.getUserByEmail({ email: email });

    if (user?.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verificationToken = user.verificationToken;

    await sendMail({
      to: user.email,
      from: "dianka211205@gmail.com",
      subject: "Welcome to Contacbook!",
      html: `To confirm your email, please, click on the <a href="http://localhost:5500/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your email, please, open the link http://localhost:5500/users/verify/${verificationToken}`,
    });

    res.status(200).send("Verification email sent");
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

    if (!user.verify) {
      throw HttpError(400, "User hasn't passed verification yet");
    }

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.SECRET,
      {
        expiresIn: "7d",
      }
    );

    await usersServices.updateUser(user.id, { token });

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
    const picture = await Jimp.read(req.file.path);
    picture.resize(250, 250).write(path.resolve(req.file.path));

    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const user = await usersServices.updateUser(req.user.id, {
      avatarURL: req.file.filename,
    });

    res.status(200).send({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};

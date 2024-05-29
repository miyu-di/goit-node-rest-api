import jwt from "jsonwebtoken";
import usersServices from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";

export const tokenValidation = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw HttpError(401, "Not authorized");
    }

    const [bearer, token] = authorizationHeader.split(" ", 2);

    if (bearer !== "Bearer") {
      throw HttpError(401, "Not authorized");
    }

    jwt.verify(token, process.env.SECRET, async (error, decode) => {
      if (error) {
        throw HttpError(401, "Not authorized");
      }

      const user = await usersServices.getUserById(decode.id);

      if (user === null) {
        throw HttpError(401, "Not authorized");
      }
      if (user.token !== token) {
        throw HttpError(401, "Not authorized");
      }

      req.user = {
        id: user._id,
        password: user.password,
        email: user.email,
        subscription: user.subscription,
        avatar: user.avatarURL,
      };
      next();
    });
  } catch (error) {
    next(error);
  }
};

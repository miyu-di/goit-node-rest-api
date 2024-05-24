import HttpError from "../helpers/HttpError.js";
import usersServices from "../services/usersServices.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const emailInLowerCase = email.toLowerCase();

        const user = await usersServices.getUserByEmail({
          email: emailInLowerCase,
        });
        if (user !== null) {
            throw HttpError(409, "Email in use");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const createdUser = await usersServices.createUser({
          email: emailInLowerCase,
          password: passwordHash,
        });
        res
          .send({
            user: {
              email: createdUser.email,
              subscription: createdUser.subscription,
            },
          })
          .status(201);
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
 try {
     const { email, password } = req.body;
     const emailInLowerCase = email.toLowerCase();

     const user = await usersServices.getUserByEmail({
       email: emailInLowerCase,
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
         name: user.name,
       },
       process.env.SECRET,
       {
         expiresIn: "7d",
       }
     );

     await usersServices.updateUser(user._id, { token });

     res.send({
         token: token,
         user: {
             email: user.email,
             subscription: user.subscription,
     }}).status(200)
 } catch (error) {
    next(error)
 }
}

export const logout = async (req, res, next) => {
    try {
        await usersServices.updateUser(req.user.id, { token: null });
        res.status(204).end();
    } catch (error) {
        next(error)
    }
}

export const currentUser = async (req, res, next) => {
  try {
      const user = await usersServices.getUserById(req.user.id);
      res.json({
        email: user.email,
        subscription: user.subscription,
      }).status(200);
  } catch (error) {
    next(error);
  }
};
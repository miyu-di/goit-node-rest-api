import User from "../models/user.js"

function getUserById(id) {
    return User.findOne({ _id: id });
}

function getUserByEmail(email) {
  return User.findOne(email);
}

function getOneUser(filter) {
  return User.findOne(filter)
}

function createUser({ email, password, verificationToken }) {
  return User.create({ email, password, verificationToken });
}

function updateUser(id, fields) {
    return User.findByIdAndUpdate({ _id: id }, fields, { new: true, });
}

export default {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  getOneUser,
};
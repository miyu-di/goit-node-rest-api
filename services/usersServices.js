import User from "../models/user.js"

function getUserById(id) {
    return User.findOne({ _id: id });
}

function getUserByEmail(email) {
  return User.findOne(email);
}

function createUser({ email, password }) {
    return User.create({ email, password });
}

function updateUser(id, fields) {
    return User.findByIdAndUpdate({ _id: id }, fields, { new: true, });
}

export default {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
};
const User = require("../models/User");

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (id) => {
  return await User.findById(id);
};

const findByGoogleId = async (googleId) => {
  return await User.findOne({ googleId });
};

const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findByGoogleId,
  updateUser,
  deleteUser,
};

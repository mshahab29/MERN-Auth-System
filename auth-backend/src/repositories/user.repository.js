const User = require("../models/User");

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findUserByEmail = async (email) => {
  return User.findOne({ email });
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

const saveRefreshToken = async (userId, refreshToken) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        refreshTokens: {
          $each: [{ token: refreshToken }],
          $slice: -5,
        },
      },
    },
    {
      returnDocument: "after",
    },
  );
};

const findUserByRefreshToken = async (userId, refreshToken) => {
  return await User.findOne({
    _id: userId,
    "refreshTokens.token": refreshToken,
  });
};

const removeRefreshToken = async (userId, refreshToken) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        refreshTokens: {
          token: refreshToken,
        },
      },
    },
    {
      returnDocument: "after",
    },
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findByGoogleId,
  updateUser,
  deleteUser,
  saveRefreshToken,
  findUserByRefreshToken,
  removeRefreshToken,
};

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

const findUserByVerificationToken = async (hashedToken) => {
  return User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: new Date() },
  });
};

const verifyUserEmail = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        isVerified: true,
      },
      $unset: {
        verificationToken: 1,
        verificationTokenExpires: 1,
      },
    },
    {
      new: true,
    },
  );
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

const removeAllRefreshTokens = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshTokens: [],
      },
    },
    {
      returnDocument: "after",
    },
  );
};

const findUserByResetPasswordToken = async (hashedToken) => {
  return User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });
};

const saveResetPasswordToken = async (userId, hashedToken, expiresAt) => {
  return User.findByIdAndUpdate(
    userId,
    {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: expiresAt,
    },
    {
      returnDocument: "after",
    },
  );
};

const clearResetPasswordToken = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        resetPasswordToken: "",
        resetPasswordExpires: "",
      },
    },
    {
      returnDocument: "after",
    },
  );
};

const resetPassword = async (userId, password) => {
  const user = await User.findById(userId);

  if (!user) {
    return null;
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return user;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findByGoogleId,
  findUserByVerificationToken,
  verifyUserEmail,
  updateUser,
  deleteUser,
  saveRefreshToken,
  findUserByRefreshToken,
  removeRefreshToken,
  findUserByResetPasswordToken,
  saveResetPasswordToken,
  clearResetPasswordToken,
  resetPassword,
  removeAllRefreshTokens,
};

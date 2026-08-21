const User = require("../models/User");

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findUserByEmail = async (email) => {
  return User.findOne({ email }).select("+password +refreshTokens");
};

const findUserById = async (id) => {
  return await User.findById(id).select("+passwordChangedAt");
};

const findByGoogleId = async (googleId) => {
  return await User.findOne({ googleId });
};

const findUserByVerificationToken = async (hashedToken) => {
  return User.findOne({
    verificationToken: hashedToken,
  }).select("+verificationToken +verificationTokenExpires +isVerified");
};

const verifyUserEmail = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        isVerified: true,
      },
      $unset: {
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
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await User.findByIdAndUpdate(userId, {
    $pull: { refreshTokens: { createdAt: { $lt: sevenDaysAgo } } },
  });

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
  }).select("+refreshTokens");
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
  }).select("+resetPasswordToken +resetPasswordExpires");
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
  const user = await User.findById(userId).select("+password");

  if (!user) {
    return null;
  }

  user.password = password;
  user.passwordChangedAt = new Date();
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

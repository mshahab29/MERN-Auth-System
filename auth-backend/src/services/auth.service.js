const userRepository = require("../repositories/user.repository");
const {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");
const { verifyGoogleIdToken } = require("../utils/googleAuth");
const { generateEmailToken } = require("../utils/emailToken");
const { sendVerificationEmail } = require("./email.service");
const crypto = require("crypto");
const ApiError = require("../utils/ApiError");

const register = async (userData) => {
  const { name, email, password } = userData;
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const { rawToken, hashedToken } = generateEmailToken();

  const newUser = await userRepository.createUser({
    name,
    email,
    password,
    verificationToken: hashedToken,
    verificationTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
  });
  await sendVerificationEmail({
    email: newUser.email,
    name: newUser.name,
    token: rawToken,
  });
  return newUser;
};

const verifyEmail = async (rawToken) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const user = await userRepository.findUserByVerificationToken(hashedToken);

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification link");
  }

  await userRepository.verifyUserEmail(user._id);

  return true;
};

const login = async (loginData) => {
  const { email, password } = loginData;
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new ApiError(404, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in.");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  await userRepository.saveRefreshToken(user._id, refreshToken);

  return { user, accessToken, refreshToken };
};

// Google LOGIN only work for an existing Google account
const googleLogin = async (credential) => {
  const googleUser = await verifyGoogleIdToken(credential);
  const { sub: googleId, email, name, picture, email_verified } = googleUser;

  if (!email_verified) {
    throw new ApiError(401, "Google email is not verified");
  }

  let user = await userRepository.findByGoogleId(googleId);

  if (!user) {
    throw new ApiError(
      404,
      "No account is registered with this Google account. Please sign up first.",
    );
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  await userRepository.saveRefreshToken(user._id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const googleSignup = async (credential) => {
  const googleUser = await verifyGoogleIdToken(credential);

  const { sub: googleId, email, name, picture, email_verified } = googleUser;

  if (!email_verified) {
    throw new ApiError(401, "Google email is not verified");
  }

  const existingGoogleUser = await userRepository.findByGoogleId(googleId);

  if (existingGoogleUser) {
    throw new ApiError(
      409,
      "This Google account is already registered. Please log in instead.",
    );
  }

  const existingEmailUser = await userRepository.findUserByEmail(email);

  if (existingEmailUser) {
    throw new ApiError(
      409,
      "An account with this email already exists. Please log in instead.",
    );
  }

  const user = await userRepository.createUser({
    name,
    email,
    avatar: picture,
    provider: "google",
    googleId,
    isVerified: true,
  });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  await userRepository.saveRefreshToken(user._id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);

  const user = await userRepository.findUserByRefreshToken(
    decoded.id,
    refreshToken,
  );

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }
  await userRepository.removeRefreshToken(user._id, refreshToken);

  const newAccessToken = generateAccessToken({
    id: user._id,
  });

  const newRefreshToken = generateRefreshToken({
    id: user._id,
  });

  await userRepository.saveRefreshToken(user._id, newRefreshToken);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logout = async (refreshToken) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    await userRepository.removeRefreshToken(decoded.id, refreshToken);
  } catch (error) {
    if (error.statusCode === 401) {
      return;
    }

    throw error;
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  googleLogin,
  googleSignup,
  refreshAccessToken,
  logout,
};

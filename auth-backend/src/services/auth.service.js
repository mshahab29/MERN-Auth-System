const userRepository = require("../repositories/user.repository");
const {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");
const { verifyGoogleIdToken } = require("../utils/googleAuth");
const { generateEmailToken } = require("../utils/emailToken");
const { generatePasswordResetToken } = require("../utils/passwordResetToken");

const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("./email.service");
const crypto = require("crypto");
const ApiError = require("../utils/ApiError");
const { parseUserAgent } = require("../utils/userAgent");

const register = async (userData) => {
  const { name, email, password } = userData;
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    if (!existingUser.isVerified) {
      throw new ApiError(
        409,
        "An unverified account with this email already exists. Please check your email or resend the verification link.",
      );
    }
    throw new ApiError(
      409,
      "An account with this email already exists. Please log in instead.",
    );
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
    throw new ApiError(400, "Invalid verification link.");
  }

  if (user.isVerified) {
    return {
      alreadyVerified: true,
      message: "Email is already verified! You can log in.",
    };
  }

  if (
    user.verificationTokenExpires &&
    user.verificationTokenExpires < new Date()
  ) {
    throw new ApiError(
      400,
      "Verification link has expired. Please request a new link.",
    );
  }

  await userRepository.verifyUserEmail(user._id);

  return {
    alreadyVerified: false,
    message: "Email verified successfully!",
  };
};

const login = async (loginData, userAgent, ip) => {
  const { email, password } = loginData;
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.provider === "google" || !user.password) {
    throw new ApiError(
      400,
      "This account was created using Google. Please sign in with Google.",
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in.");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  await userRepository.saveRefreshToken(user._id, refreshToken, userAgent, ip);

  return { user, accessToken, refreshToken };
};

// Google LOGIN only work for an existing Google account
const googleLogin = async (credential, userAgent, ip) => {
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

  await userRepository.saveRefreshToken(user._id, refreshToken, userAgent, ip);

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const googleSignup = async (credential, userAgent, ip) => {
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

  await userRepository.saveRefreshToken(user._id, refreshToken, userAgent, ip);

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const resendVerification = async (email) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    // Return true silently to prevent account enumeration
    return true;
  }

  if (user.isVerified) {
    throw new ApiError(400, "This account is already verified. Please log in.");
  }

  const { rawToken, hashedToken } = generateEmailToken();

  await userRepository.updateUser(user._id, {
    verificationToken: hashedToken,
    verificationTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
  });

  await sendVerificationEmail({
    email: user.email,
    name: user.name,
    token: rawToken,
  });

  return true;
};

const refreshAccessToken = async (refreshToken, userAgent, ip) => {
  const decoded = verifyRefreshToken(refreshToken);

  const user = await userRepository.findUserByRefreshToken(
    decoded.id,
    refreshToken,
  );

  if (!user) {
    // REUSE DETECTION: Token passed JWT verification but is missing from DB.
    // Revoke all tokens for this user account.
    await userRepository.removeAllRefreshTokens(decoded.id);
    throw new ApiError(
      401,
      "Security alert: Refresh token reuse detected. All active sessions have been revoked. Please log in again.",
    );
  }
  await userRepository.removeRefreshToken(user._id, refreshToken);

  const newAccessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  const newRefreshToken = generateRefreshToken({
    id: user._id,
  });

  await userRepository.saveRefreshToken(
    user._id,
    newRefreshToken,
    userAgent,
    ip,
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const getActiveSessions = async (userId, currentRefreshToken) => {
  const user = await userRepository.findUserSessions(userId);

  if (!user || !user.refreshTokens) {
    return [];
  }

  return user.refreshTokens.map((session) => {
    const parsed = parseUserAgent(session.userAgent);
    return {
      id: session._id,
      device: parsed.label,
      browser: parsed.browser,
      os: parsed.os,
      deviceType: parsed.deviceType,
      ip: session.ip,
      createdAt: session.createdAt,
      isCurrent: session.token === currentRefreshToken,
    };
  });
};

const revokeSession = async (userId, sessionId, currentRefreshToken) => {
  const user = await userRepository.findUserSessions(userId);

  if (!user || !user.refreshTokens) {
    throw new ApiError(404, "Session not found");
  }

  const targetSession = user.refreshTokens.find(
    (s) => s._id.toString() === sessionId,
  );

  if (!targetSession) {
    throw new ApiError(404, "Session not found");
  }

  const isCurrentSession = targetSession.token === currentRefreshToken;

  await userRepository.removeSessionById(userId, sessionId);

  return { isCurrentSession };
};

const revokeAllOtherSessions = async (userId, currentRefreshToken) => {
  await userRepository.removeAllOtherSessions(userId, currentRefreshToken);
  return true;
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

const forgotPassword = async (email) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    return;
  }

  if (!user.isVerified) {
    throw new ApiError(
      403,
      "Your email address is not verified. Please verify your email before resetting your password.",
    );
  }

  // Google-only accounts don't have a password to reset
  if (user.provider === "google") {
    throw new ApiError(
      400,
      "This account uses Google login. Please continue with Google.",
    );
  }

  const { rawToken, hashedToken } = generatePasswordResetToken();

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await userRepository.saveResetPasswordToken(user._id, hashedToken, expiresAt);

  await sendPasswordResetEmail({
    email: user.email,
    name: user.name,
    token: rawToken,
  });

  return true;
};

const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const user = await userRepository.findUserByResetPasswordToken(hashedToken);

  if (!user) {
    throw new ApiError(400, "Invalid or expired password reset link");
  }

  await userRepository.resetPassword(user._id, newPassword);
  await userRepository.removeAllRefreshTokens(user._id);

  return true;
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  googleLogin,
  googleSignup,
  refreshAccessToken,
  getActiveSessions,
  revokeSession,
  revokeAllOtherSessions,
  logout,
  forgotPassword,
  resetPassword,
};

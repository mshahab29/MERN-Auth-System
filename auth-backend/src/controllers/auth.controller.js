const authService = require("../services/auth.service");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const env = require("../config/env");

const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const register = async (req, res) => {
  const newUser = await authService.register(req.body);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "User registered successfully. Check you email for verification.",
        newUser,
      ),
    );
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new ApiError(400, "Verification token is required");
  }

  const result = await authService.verifyEmail(token);

  res
    .status(200)
    .json(
      new ApiResponse(200, result.message, {
        alreadyVerified: result.alreadyVerified,
      }),
    );
};

const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  await authService.resendVerification(email);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "If an unverified account exists with this email, a verification link has been sent.",
      ),
    );
};

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res
    .status(200)
    .cookie("refreshToken", refreshToken, getCookieOptions())
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user,
        accessToken,
      }),
    );
};

const googleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Google credential is required");
  }

  const result = await authService.googleLogin(credential);

  const { accessToken, refreshToken, user } = result;

  res.cookie("refreshToken", refreshToken, getCookieOptions());

  res.status(200).json(
    new ApiResponse(200, "Google login successful", {
      accessToken,
      user,
    }),
  );
};

const googleSignup = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Google credential is required");
  }

  const result = await authService.googleSignup(credential);

  const { accessToken, refreshToken, user } = result;

  res.cookie("refreshToken", refreshToken, getCookieOptions());

  res.status(201).json(
    new ApiResponse(201, "Google signup successful", {
      accessToken,
      user,
    }),
  );
};

const getMe = async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, "User retrieved successfully", req.user));
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not provided");
  }

  const tokens = await authService.refreshAccessToken(refreshToken);

  res.cookie("refreshToken", tokens.refreshToken, getCookieOptions());

  res.status(200).json(
    new ApiResponse(200, "Access token refreshed successfully", {
      accessToken: tokens.accessToken,
    }),
  );
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  res.clearCookie("refreshToken", { path: "/api/auth" });

  res.status(200).json(new ApiResponse(200, "Logged out successfully"));
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  await authService.forgotPassword(email);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "If an account exists with this email, a password reset link has been sent.",
      ),
    );
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token) {
    throw new ApiError(400, "Reset token is required");
  }

  if (!password) {
    throw new ApiError(400, "New password is required");
  }

  await authService.resetPassword(token, password);

  res.status(200).json(new ApiResponse(200, "Password reset successfully"));
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  googleLogin,
  googleSignup,
  getMe,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};

const authService = require("../services/auth.service");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const env = require("../config/env");

const register = async (req, res) => {
  const newUser = await authService.register(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", newUser));
};

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  const cookieOptions = {
    httpOnly: true, // protection against XSS
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user,
        accessToken,
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

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true, // protection against XSS
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

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

  res.clearCookie("refreshToken");

  res.status(200).json(new ApiResponse(200, "Logged out successfully"));
};

module.exports = {
  register,
  login,
  getMe,
  refresh,
  logout,
};

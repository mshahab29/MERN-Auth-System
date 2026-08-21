const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { verifyAccessToken } = require("../utils/jwt");
const userRepository = require("../repositories/user.repository");

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(
      401,
      "Not authorized to access this route. No token provided.",
    );
  }

  const decoded = verifyAccessToken(token);

  const currentUser = await userRepository.findUserById(decoded.id);
  if (!currentUser) {
    throw new ApiError(401, "User no longer exists.");
  }

  if (currentUser.passwordChangedAt) {
    const changedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    if (decoded.iat < changedTimestamp) {
      throw new ApiError(
        401,
        "User recently changed password. Please log in again.",
      );
    }
  }

  req.user = currentUser;

  next();
});

module.exports = authenticate;

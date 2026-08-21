const ApiError = require("../utils/ApiError");

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You are not authorized to access this resource");
    }

    next();
  };
};

module.exports = authorize;

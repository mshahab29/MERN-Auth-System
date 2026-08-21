const ApiResponse = require("../utils/ApiResponse");

const userArea = async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, "User area accessed successfully", {
      message: "You have access to the user area.",
      user: req.user,
    }),
  );
};

const adminArea = async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, "Admin area accessed successfully", {
      message: "You have access to the admin area.",
      user: req.user,
    }),
  );
};

module.exports = {
  userArea,
  adminArea,
};

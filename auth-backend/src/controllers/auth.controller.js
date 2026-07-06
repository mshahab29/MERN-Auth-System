const authService = require("../services/auth.service");
const ApiError = require("../utils/ApiError");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Please provide name, email, and password");
  }
  const newUser = await authService.register(name, email, password);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
    },
  });
};

module.exports = {
  register,
};

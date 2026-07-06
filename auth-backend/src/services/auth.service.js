const userRepository = require("../repositories/user.repository");
const ApiError = require("../utils/ApiError");

const register = async (name, email, password) => {
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const newUser = await userRepository.createUser({ name, email, password });
  return newUser;
};

module.exports = {
  register,
};

import api from "../api/axios";

const register = async (userData) => {
  const response = await api.post("/auth/signup", userData);

  return response.data;
};

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};
const refresh = async () => {
  const response = await api.post("/auth/refresh");

  return response.data;
};

const getMe = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

const logout = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

const authService = {
  register,
  login,
  refresh,
  getMe,
  logout,
};
export default authService;

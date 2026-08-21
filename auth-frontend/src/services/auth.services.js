import api from "../api/axios";

const register = async (userData) => {
  const response = await api.post("/auth/signup", userData);

  return response.data;
};

const verifyEmail = async (token) => {
  const response = await api.get("/auth/verify-email", {
    params: {
      token,
    },
  });

  return response.data;
};

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

const googleLogin = async (credential) => {
  const response = await api.post("/auth/google-login", {
    credential,
  });

  return response.data;
};

const googleSignup = async (credential) => {
  const response = await api.post("/auth/google-signup", {
    credential,
  });

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

const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

const resetPassword = async (token, password) => {
  const response = await api.post("/auth/reset-password", {
    token,
    password,
  });

  return response.data;
};

const resendVerification = async (email) => {
  const response = await api.post("/auth/resend-verification", { email });
  return response.data;
};

const authService = {
  register,
  login,
  refresh,
  getMe,
  logout,
  googleLogin,
  googleSignup,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
export default authService;

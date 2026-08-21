import api from "../api/axios";

const getUserArea = async () => {
  const response = await api.get("/rbac/user-area");
  return response.data;
};

const getAdminArea = async () => {
  const response = await api.get("/rbac/admin-area");
  return response.data;
};

const rbacService = {
  getUserArea,
  getAdminArea,
};

export default rbacService;

import { thresholdApi } from "./thresholdApi.js";

export const fetchPublicUser = async (username) => {
  const response = await thresholdApi.get(`/users/${username}`);
  return response.data;
};

export const checkUserNameAvailibility = async (username) => {
  const response = await thresholdApi.get(`/auth/check-username/${username}`);
  return response.data;
};

export const registerNewUser = async (userData) => {
  const response = await thresholdApi.post("/auth/signup", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await thresholdApi.post("/auth/login", userData);
  return response.data;
};

export const getAdminUser = async () => {
  const response = await thresholdApi.get("/users/me");
  return response.data;
};

export const updateUser = async (userData) => {
  const response = await thresholdApi.patch("/users/me", userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await thresholdApi.post("/auth/logout");
  return response.data;
};

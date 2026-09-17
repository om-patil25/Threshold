import { thresholdApi } from "./thresholdApi";

export const fetchLinks = async () => {
  const response = await thresholdApi.get("/links");
  return response.data;
};

export const createLink = async (linkData) => {
  const response = await thresholdApi.post("/links", linkData);
  return response.data;
};

export const updateLink = async (id, linkData) => {
  const response = await thresholdApi.patch(`/links/${id}`, linkData);
  return response.data;
};

export const deleteLink = async (id) => {
  const response = await thresholdApi.delete(`/links/${id}`);
  return response.data;
};

export const registerClick = async (id) => {
  await thresholdApi.get(`/click/${id}`);
};

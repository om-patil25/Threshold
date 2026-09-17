import { thresholdApi } from "./thresholdApi";

export const fetchUpdates = async () => {
  const response = await thresholdApi.get("/updates");
  return response.data;
};

export const createUpdate = async (updateData) => {
  const response = await thresholdApi.post("/updates", updateData);
  return response.data;
};

export const patchUpdate = async (id, updateData) => {
  const response = await thresholdApi.patch(`/updates/${id}`, updateData);
  return response.data;
};

export const deleteUpdate = async (id) => {
  const response = await thresholdApi.delete(`/updates/${id}`);
  return response.data;
};

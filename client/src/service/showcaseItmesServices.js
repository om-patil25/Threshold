import { thresholdApi } from "./thresholdApi";

export const fetchShowcaseItems = async () => {
  const response = await thresholdApi.get("/showcase-items");
  return response.data;
};

export const createShowcaseItem = async (itemData) => {
  const response = await thresholdApi.post("/showcase-items", itemData);
  return response.data;
};

export const updateShowcaseItem = async (id, itemData) => {
  const response = await thresholdApi.patch(`/showcase-items/${id}`, itemData);
  return response.data;
};

export const deleteShowcaseItem = async (id) => {
  const response = await thresholdApi.delete(`/showcase-items/${id}`);
  return response.data;
};

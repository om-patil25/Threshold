import { thresholdApi } from "./thresholdApi";

export const alltimeAnalytics = async () => {
  const response = await thresholdApi.get("/analytics");
  return response.data;
};

export const timeSeriesAnalytics = async (days) => {
  const response = await thresholdApi.get(`/analytics/timeseries/${days}`);
  return response.data;
};

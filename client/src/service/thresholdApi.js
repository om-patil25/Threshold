import axios from "axios";

export const thresholdApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
});

thresholdApi.interceptors.response.use(
  (response) => response, // success — pass through unchanged
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

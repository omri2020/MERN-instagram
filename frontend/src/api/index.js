import axios from "axios";
import {
  getToken,
  isTokenExpired,
  setToken,
  clearToken,
} from "../services/tokenService";

export const APIWithoutInterceptor = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

API.interceptors.request.use(
  async (config) => {
    const token = getToken();
    console.log("Token inside interceptor", token);
    if (token && !isTokenExpired(token)) {
      // Token is valid, attach it to the request
      console.log("Token is valid, attaching it to the request");
      config.headers["Authorization"] = `Bearer ${token}`;
    } else if (token) {
      // Token exists but is expired, attempt to refresh it
      console.log("Token exists but is expired, attempting to refresh it");
      try {
        console.log("Attempting to refresh token");
        const response = await APIWithoutInterceptor.post("/users/refresh");
        const newAccessToken = response.data.accessToken;
        console.log("newAccessToken", newAccessToken);
        setToken(newAccessToken); // Update your in-memory token
        config.headers["Authorization"] = `Bearer ${newAccessToken}`; // Update the headers with the new token
        console.log("Token refreshed successfully");
      } catch (error) {
        console.error("Error refreshing access token", error);
        clearToken(); // Ensure the expired token is removed
        return Promise.reject(error);
      }
    }
    // If there is no token, don't attempt to attach or refresh it
    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => response, // Just return the response if it's successful
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Set the retry flag to prevent infinite loops

      try {
        const refreshResponse =
          await APIWithoutInterceptor.post("/users/refresh");
        const newAccessToken = refreshResponse.data.accessToken;
        setToken(newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        console.log("Token refreshed successfully");
        return API(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        clearToken(); // Ensure the expired token is removed
        return Promise.reject(refreshError); // Reject the promise to stop the loop
      }
    }

    return Promise.reject(error); // Reject the promise for all other errors
  },
);

export default API;

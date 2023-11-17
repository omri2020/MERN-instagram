import { jwtDecode } from "jwt-decode";
import { APIWithoutInterceptor } from "../api";

export const getToken = () => {
  return localStorage.getItem("accessToken") ?? false;
};

export const setToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const clearToken = () => {
  console.log("clearing token");
  localStorage.removeItem("accessToken");
};

export const isTokenExpired = (token) => {
  if (!token) {
    return true; // If no token is provided, assume it is expired.
  }

  // Check if the token has three parts separated by dots (header, payload, signature)
  const parts = token.split(".");
  if (parts.length !== 3) {
    console.error("Invalid token format", token);
    return true; // If the token doesn't have three parts, consider it expired.
  }

  try {
    // Decode the token to get its expiration time
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Compare the expiration time with the current time
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // If there's an error decoding, consider the token expired.
  }
};

export const isTokenExpiringSoon = (token) => {
  if (!token) {
    return false; // If no token is provided, assume it is not expiring soon.
  }

  // Check if the token has three parts separated by dots (header, payload, signature)
  const parts = token.split(".");
  if (parts.length !== 3) {
    console.error("Invalid token format", token);
    return false; // If the token doesn't have three parts, consider it not expiring soon.
  }

  try {
    // Decode the token to get its expiration time
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Compare the expiration time with the current time
    return decoded.exp < currentTime + 300; // 300 seconds = 5 minutes
  } catch (error) {
    console.error("Error decoding token:", error);
    return false; // If there's an error decoding, consider the token not expiring soon.
  }
};

export const refreshAuthToken = async () => {
  try {
    const response = await APIWithoutInterceptor.post("/users/refresh");
    const newToken = response.data.accessToken;
    setToken(newToken);
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

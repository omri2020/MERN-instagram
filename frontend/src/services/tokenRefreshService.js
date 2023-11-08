// tokenRefreshService.js
import {
  getToken,
  isTokenExpiringSoon,
  setToken,
} from "../services/tokenService";
import { APIWithoutInterceptor } from "../api/index"; // Assuming this is your Axios instance without interceptors

const refreshTokenPeriodically = () => {
  const intervalId = setInterval(
    async () => {
      const token = getToken();

      if (token && isTokenExpiringSoon(token)) {
        try {
          const response = await APIWithoutInterceptor.post("/users/refresh");
          const newAccessToken = response.data.accessToken;
          setToken(newAccessToken);
        } catch (error) {
          console.error("Error refreshing token:", error);
          clearInterval(intervalId); // Stop trying if there's an error
        }
      }
    },
    5 * 60 * 1000,
  ); // Run this every 5 minutes or adjust as needed

  return () => clearInterval(intervalId); // Return a cleanup function
};

export default refreshTokenPeriodically;

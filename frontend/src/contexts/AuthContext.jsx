import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getToken,
  isTokenExpired,
  refreshAuthToken,
} from "../services/tokenService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState("authenticating"); // "authenticating", "authenticated", "unauthenticated"

  useEffect(() => {
    const checkAuth = async () => {
      let token = getToken();
      if (!token || isTokenExpired(token)) {
        token = await refreshAuthToken(); // Implement this function to handle token refresh
      }
      setAuthStatus(token ? "authenticated" : "unauthenticated");
    };

    checkAuth();
  }, []);

  const contextValue = useMemo(() => ({ authStatus }), [authStatus]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

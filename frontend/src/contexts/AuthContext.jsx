import React, { createContext, useContext, useEffect } from "react";
import { getToken, isTokenExpired } from "../services/tokenService";
import refreshTokenPeriodically from "../services/tokenRefreshService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(token && !isTokenExpired(token));
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const cleanup = refreshTokenPeriodically();

      return cleanup;
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        setIsAuthenticated,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

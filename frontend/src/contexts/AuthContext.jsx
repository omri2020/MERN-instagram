// import React, { createContext, useContext, useEffect } from "react";
// import { getToken, isTokenExpired } from "../services/tokenService";
// import refreshTokenPeriodically from "../services/tokenRefreshService";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = React.useState(null);

//   useEffect(() => {
//     const token = getToken();
//     setIsAuthenticated(token && !isTokenExpired(token));
//   }, [isAuthenticated]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       const cleanup = refreshTokenPeriodically();

//       return cleanup;
//     }
//   }, [isAuthenticated]);

//   return (
//     <AuthContext.Provider
//       value={{
//         setIsAuthenticated,
//         isAuthenticated,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// Memoized version of AuthContext.jsx

// import React, { createContext, useContext, useEffect, useMemo } from "react";
// import { getToken, isTokenExpired } from "../services/tokenService";
// import refreshTokenPeriodically from "../services/tokenRefreshService";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = React.useState(null);

//   // Function to check if the token is valid
//   const checkTokenValidity = () => {
//     const token = getToken();
//     return token && !isTokenExpired(token);
//   };

//   // Effect for initial token validation
//   useEffect(() => {
//     setIsAuthenticated(checkTokenValidity());
//     // Removed isAuthenticated from the dependency array
//   }, []);

//   // Effect for refreshing token periodically
//   useEffect(() => {
//     if (isAuthenticated) {
//       const cleanup = refreshTokenPeriodically();
//       return cleanup;
//     }
//   }, [isAuthenticated]);

//   // Memoizing the context value
//   const contextValue = useMemo(
//     () => ({
//       setIsAuthenticated,
//       isAuthenticated,
//     }),
//     [isAuthenticated],
//   );

//   return (
//     <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// new version of AuthContext.jsx
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

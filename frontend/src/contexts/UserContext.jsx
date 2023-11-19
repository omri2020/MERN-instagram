import React, { createContext, useContext, useMemo } from "react";
import { useUser } from "../features/user/useUser";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { user, isLoading, isFetching, isError, isSuccess } = useUser();

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      isFetching,
      isError,
      isSuccess,
    }),
    [user, isLoading, isFetching, isError, isSuccess],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

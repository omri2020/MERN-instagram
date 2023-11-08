import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getCurrentUser } from "../api/user";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState({});

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     const fetchUser = async () => {
  //       const { user } = await getCurrentUser();
  //       setUser(user);
  //     };

  //     fetchUser();
  //   }
  // }, [isAuthenticated]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

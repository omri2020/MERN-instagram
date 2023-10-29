import { useEffect, useContext, createContext } from "react";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "../services/socketService";

const SocketContext = createContext(null);

export const SocketProvider = ({ children, token }) => {
  console.log("Token updated:", token);
  useEffect(() => {
    if (token) {
      connectSocket(token);
    }
    return () => {
      disconnectSocket();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={getSocket()}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

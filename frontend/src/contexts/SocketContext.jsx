import React, { useEffect, useContext, createContext, useState } from "react";
import { connectSocket, disconnectSocket } from "../services/socketService";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Connecting socket due to authentication...");
      const newSocket = connectSocket();

      setSocket(newSocket);

      const handleConnect = () => {
        console.log("Socket.IO connected!");
        setIsConnected(true);
      };

      const handleDisconnect = () => {
        console.log("Socket.IO disconnected.");
        setIsConnected(false);
      };

      const handleError = (error) => {
        console.error("Socket.IO Error:", error);
        setIsConnected(false);
      };

      newSocket.on("connect", handleConnect);
      newSocket.on("disconnect", handleDisconnect);
      newSocket.on("error", handleError);

      return () => {
        console.log("Disconnecting socket...");
        disconnectSocket(newSocket);
        newSocket.off("connect", handleConnect);
        newSocket.off("disconnect", handleDisconnect);
        newSocket.off("error", handleError);
      };
    } else {
      if (socket) {
        console.log("Disconnecting socket due to auth state...");
        disconnectSocket(socket);
      }
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
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

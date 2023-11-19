import React, { useEffect, useContext, createContext, useState } from "react";
import { connectSocket, disconnectSocket } from "../services/socketService";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  console.log("SocketContext: useState initialized");
  const { authStatus } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  // Connect/disconnect the socket when the auth state changes
  useEffect(() => {
    console.log("SocketContext: Authenticated - attempting to connect socket");
    if (authStatus === "authenticated") {
      console.log("Connecting socket due to authentication...");
      const newSocket = connectSocket();
      setSocket(newSocket);

      const handleConnect = () => {
        console.log("Socket.IO connected!");
        setIsConnected(true);
      };

      const handlePingPong = () => {
        newSocket.emit("pong");
      };

      const handleDisconnectAck = () => {
        console.log(
          `Disconnection acknowledged by server for socket ${newSocket.id}`,
        );
      };

      const handleDisconnect = () => {
        console.log("Socket.IO disconnected.");
        setIsConnected(false);
        setSocket(null);
      };

      const handleError = (error) => {
        console.error("Socket.IO Error:", error);
        setIsConnected(false);
      };

      newSocket.on("connect", handleConnect);
      newSocket.on("disconnect", handleDisconnect);
      newSocket.on("error", handleError);
      newSocket.on("ping", handlePingPong);
      newSocket.on("disconnect_ack", handleDisconnectAck);

      console.log(
        "SocketContext: Cleanup - disconnecting socket and removing listeners",
      );
      return () => {
        console.log("Disconnecting socket...");
        disconnectSocket(newSocket);
        newSocket.off("connect", handleConnect);
        newSocket.off("disconnect", handleDisconnect);
        newSocket.off("error", handleError);
        newSocket.off("ping", handlePingPong);
        newSocket.off("disconnect_ack", handleDisconnectAck);
      };
    } else {
      if (authStatus === "unauthenticated" && socket) {
        console.log("Disconnecting socket due to auth state...");
        disconnectSocket(socket);
        setSocket(null);
      }
    }
  }, [authStatus]);

  // Subscribe to chat update events

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

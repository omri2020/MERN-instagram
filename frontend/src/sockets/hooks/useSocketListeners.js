import { useEffect } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { useAuth } from "../../contexts/AuthContext";

export const useSocketListeners = () => {
  const { socket, isConnected } = useSocket();
  const { authStatus } = useAuth();

  useEffect(() => {
    if (socket && isConnected && authStatus === "authenticated") {
      console.log("Setting up socket listeners");
      socket.emit("readyForMessages");

      socket.on("userLoggedIn", (data) => {
        console.log("User logged in:", data.username);
      });

      // Add more listeners as needed
    }

    return () => {
      if (socket && isConnected) {
        console.log("Cleaning up socket listeners");
        socket.off("userLoggedIn");
        // Remove other listeners as needed
      }
    };
  }, [socket, isConnected, authStatus]); // Re-run this effect if the socket instance changes
};

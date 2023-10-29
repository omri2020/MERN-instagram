import { useEffect } from "react";
import { getSocket } from "../services/socketService";

export const useSocketListeners = () => {
  useEffect(() => {
    const socket = getSocket();
    socket?.emit("readyForMessages");

    if (socket) {
      socket.on("userLoggedIn", (data) => {
        console.log("User logged in:", data.username);
        // Handle user logged in event
      });

      // Add more listeners as needed
    }

    return () => {
      if (socket) {
        socket.off("userLoggedIn");
        socket.off("postLiked");
        socket.off("postUnliked");
        // Remove other listeners as needed
      }
    };
  }, []);
};

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../contexts/SocketContext";
import {
  handleMessageReceived,
  handleNewNotification,
  handleNewChat,
} from "../handlers/chatUpdateHandlers";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../contexts/AuthContext";

export const useChatSocketListeners = () => {
  const { authStatus } = useAuth();
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isConnected && socket && authStatus === "authenticated") {
      const newChatHandler = handleNewChat(queryClient);
      const messageReceivedHandler = handleMessageReceived(queryClient);
      const newNotificationHandler = handleNewNotification(queryClient, uuidv4);

      socket.on("newChat", newChatHandler);
      socket.on("message", messageReceivedHandler);
      socket.on("newNotification", newNotificationHandler);

      return () => {
        socket.off("newChat", newChatHandler);
        socket.off("message", messageReceivedHandler);
        socket.off("newNotification", newNotificationHandler);
      };
    }
  }, [socket, isConnected, queryClient, authStatus]);
};

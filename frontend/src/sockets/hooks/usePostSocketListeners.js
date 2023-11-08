import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../contexts/SocketContext";

export const usePostSocketListener = (postId, handlerCreator, eventName) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  const handleEvent = useCallback(
    (data) => {
      if (data.postId !== postId) return;
      console.log(
        `In ${eventName} Before Update:`,
        queryClient.getQueryData(["userFeed"]),
      );

      const handler = handlerCreator(queryClient, postId);
      handler(data);

      console.log(
        `In ${eventName} After Update:`,
        queryClient.getQueryData(["userFeed"]),
      );
    },
    [queryClient, postId, handlerCreator, eventName],
  );

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    const eventHandler = (data, callback) => {
      console.log(`${eventName} event received:`, data);
      handleEvent(data);
      if (callback) callback("Event received successfully");
    };

    socket.on(eventName, eventHandler);

    return () => {
      socket.off(eventName, eventHandler);
    };
  }, [socket, isConnected, eventName, handleEvent]);
};

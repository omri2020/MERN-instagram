import React from "react";
import { useSocket } from "../../../contexts/SocketContext";

export const useTyping = () => {
  const { socket } = useSocket();

  const [typingStatus, setTypingStatus] = React.useState({});

  React.useEffect(() => {
    if (!socket) return;

    socket.on("typing", ({ username, chatId }) => {
      setTypingStatus((prev) => ({
        ...prev,
        [chatId]: username,
      }));
    });

    socket.on("stopped_typing", ({ username, chatId }) => {
      setTypingStatus((prev) => ({
        ...prev,
        [chatId]: null,
      }));
    });

    return () => {
      socket.off("typing");
      socket.off("stopped_typing");
    };
  }, [socket]);

  return { typingStatus };
};

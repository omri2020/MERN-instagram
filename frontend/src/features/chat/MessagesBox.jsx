import React from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../contexts/SocketContext";
import { useChat } from "../../contexts/ChatContext";
import MessageBar from "./MessageBar";
import MessagesContainer from "./MessagesContainer";
import MessagesBoxTitle from "./MessagesBoxTitle";
import MiniLoader from "../../components/MiniLoader";
import { useChatMessages } from "./hooks/useChatMessages";

const MessagesBox = () => {
  const { chatId } = useParams();
  const { socket, isConnected } = useSocket();
  const { setCurrentChatId } = useChat();
  const queryClient = useQueryClient();
  const [isLoadingChat] = useOutletContext();
  const { messagesData, isLoading, isFetching, refetchMessages } =
    useChatMessages(chatId);

  React.useEffect(() => {
    if (isConnected && socket && chatId) {
      setCurrentChatId(chatId);
      console.log("Socket emmited:", socket.id);
      socket.emit("joinChat", chatId);
    }

    return () => {
      if (socket) {
        socket.emit("leaveChat", chatId);
      }
      setCurrentChatId(null);
    };
  }, [socket, isConnected, chatId, setCurrentChatId]);

  React.useEffect(() => {
    const queryState = queryClient.getQueryState(["chatMessages", chatId]);
    const staleTime = 300000; // 5 minutes in milliseconds

    // Check if data is stale
    if (queryState && Date.now() - queryState.dataUpdatedAt > staleTime) {
      refetchMessages();
    }
  }, [chatId, queryClient, refetchMessages]);

  const messages = messagesData?.messages;

  return (
    <div className="col-span-3 flex h-screen w-full flex-col">
      <MessagesBoxTitle />
      {isLoadingChat || isLoading || isFetching ? (
        <div className="flex items-start justify-center pt-5">
          <MiniLoader />
        </div>
      ) : (
        <MessagesContainer messages={messages} />
      )}

      <MessageBar chatId={chatId} />
    </div>
  );
};

export default MessagesBox;

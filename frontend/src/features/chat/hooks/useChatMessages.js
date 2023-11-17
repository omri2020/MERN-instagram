import { useQuery } from "@tanstack/react-query";
import { getAllChatMessages } from "../../../api/chat";

export const useChatMessages = (chatId) => {
  const {
    data: messagesData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["chatMessages", chatId],
    queryFn: getAllChatMessages,
    staleTime: 5 * 60 * 1000,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!chatId,
  });

  return {
    messagesData,
    isLoading,
    isFetching,
    refetchMessages: refetch,
  };
};

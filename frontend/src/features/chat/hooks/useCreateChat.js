import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChat as createChatApi } from "../../../api/chat";

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  const createChatMutation = useMutation({
    mutationKey: ["chat", "create"],
    mutationFn: createChatApi,
    gcTime: 1000 * 60 * 5,
  });

  const createChat = async (data) => {
    return new Promise((resolve, reject) => {
      createChatMutation.mutate(data, {
        onSuccess: (data) => {
          resolve(data.chat);
          queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  return {
    createChat,
    chat: createChatMutation?.data?.chat,
    isLoadingChat: createChatMutation.isPending,
    isError: createChatMutation.isError,
  };
};

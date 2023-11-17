import { useCallback, useState } from "react";
import { useUser } from "../../user/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage as sendMessageApi } from "../../../api/chat";
import { v4 as uuidv4 } from "uuid";

export const useSendMessage = () => {
  const { user } = useUser();
  const [message, setMessage] = useState("");

  const userId = user?._id;
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationKey: ["chat", "sendMessage"],
    mutationFn: sendMessageApi,
    onMutate: ({ chatId, message }) => {
      const tempId = "temporary" + uuidv4();
      const previousChat = queryClient.getQueryData(["chatMessages", chatId]);
      queryClient.setQueryData(["chatMessages", chatId], (old) => {
        return {
          ...old,
          messages: [
            ...old.messages,
            { message, sender: { _id: userId }, _id: tempId },
          ],
        };
      });
      setMessage("");
      return () =>
        queryClient.setQueryData(["chatMessages", chatId], previousChat);
    },
    onSuccess: (data) => {
      const message = data.message;
      queryClient.setQueryData(["chatMessages", message.chat], (old) => {
        const updatedMessages = old.messages.map((m) =>
          m._id.startsWith("temporary") ? message : m,
        );
        return {
          ...old,
          messages: updatedMessages,
        };
      });
    },
  });

  const sendMessage = useCallback(
    (chatId, message) => {
      sendMessageMutation.mutate({ chatId, message });
    },
    [sendMessageMutation],
  );

  return {
    sendMessage,
    message,
    setMessage,
  };
};

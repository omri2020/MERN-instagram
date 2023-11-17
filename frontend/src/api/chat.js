import API from "./index";
import catchAsync from "../utils/catchAsync";

export const createChat = catchAsync(
  async ({ participants, chatName, isGroupChat }) => {
    const res = await API.post("/chat", {
      participants,
      chatName,
      isGroupChat,
    });
    return res.data;
  },
);

export const sendMessage = catchAsync(async ({ chatId, message }) => {
  const res = await API.post(`/chat/${chatId}/messages`, {
    messageContent: message,
  });
  return res.data;
});

export const getChat = catchAsync(async ({ queryKey }) => {
  const [, chatId] = queryKey;
  const res = await API.get(`/chat/${chatId}`);
  return res.data;
});

export const getAllChatMessages = catchAsync(async ({ queryKey }) => {
  const [, chatId] = queryKey;
  const res = await API.get(`/chat/${chatId}/messages`);
  return res.data;
});

export const readAllMessages = catchAsync(async ({ chatId }) => {
  const res = await API.patch(`/chat/${chatId}/read`);
  return res.data;
});

export const readMessage = catchAsync(async ({ messageId }) => {
  const res = await API.patch(`/chat/${messageId}/read-message`);
  return res.data;
});

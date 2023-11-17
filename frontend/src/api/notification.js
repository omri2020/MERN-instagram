import API from "./index";
import catchAsync from "../utils/catchAsync";

export const addNotification = catchAsync(async (chatId) => {
  const res = await API.post(`/chat/${chatId}/notifications`);
  return res.data;
});

export const removeNotification = catchAsync(async (chatId) => {
  const res = await API.patch(`/chat/${chatId}/notifications`);
  return res.data;
});

export const getAllNotifications = catchAsync(async () => {
  const res = await API.get(`/users/notifications`);
  return res.data;
});

import { getAllChatMessages } from "../../api/chat";

export const handleNewChat = (queryClient) => (data) => {
  console.log("New chat", data);

  // Add the new chat to the local state
  queryClient.setQueryData(["chats"], (old) => {
    if (Array.isArray(old.chats)) {
      return { ...old, chats: [...old.chats, data] };
    } else {
      queryClient.setQueryData(["chats"], {
        status: "success",
        chats: [data],
      });
    }
  });
};

export const handleMessageReceived = (queryClient) => async (data) => {
  console.log("Message received", data);
  // Update the local state with the new message
  let existingData = queryClient.getQueryData(["chatMessages", data.chat]);

  if (!existingData) {
    // Fetch the chat messages from the server
    const messagesData = await getAllChatMessages({
      queryKey: ["chatMessages", data.chat],
    });
    queryClient.setQueryData(["chatMessages", data.chat], messagesData);
  }

  queryClient.setQueryData(["chatMessages", data.chat], (old) => {
    if (old && old.messages) {
      return { ...old, messages: [...old.messages, data] };
    }
    return {
      status: "success",
      messages: [data],
    };
  });

  // Update the chat's last message
  queryClient.setQueryData(["chats"], (old) => {
    if (Array.isArray(old?.chats)) {
      const chatIndex = old.chats.findIndex((chat) => chat._id === data.chat);
      if (chatIndex !== -1) {
        const updatedChats = old.chats.map((chat, index) =>
          index === chatIndex
            ? {
                ...chat,
                latestMessage: {
                  _id: data._id,
                  message: data.message,
                  createdAt: data.createdAt,
                },
              }
            : chat,
        );
        return {
          ...old,
          chats: updatedChats,
        };
      }
    }
    return old;
  });
};

export const handleNewNotification =
  (queryClient, uuidv4) => (notificationData) => {
    console.log("New notification received", notificationData);

    queryClient.setQueryData(["notifications"], (oldNotifications) => {
      // Check if the notifications object exists and has a chatNotifications array
      if (
        !oldNotifications ||
        !oldNotifications.notification ||
        !Array.isArray(oldNotifications.notification.chatNotifications)
      ) {
        console.warn("Unexpected notifications format in cache");
        return {
          status: "success",
          notification: {
            chatNotifications: [],
          },
        };
      }

      // Find an existing notification for the chat
      const chatNotifications = oldNotifications.notification.chatNotifications;
      const existingNotificationIndex = chatNotifications.findIndex(
        (notif) => notif.chat === notificationData.chatId,
      );

      if (existingNotificationIndex !== -1) {
        // Update the unread count for the existing notification
        const updatedChatNotifications = chatNotifications.map(
          (notif, index) =>
            index === existingNotificationIndex
              ? { ...notif, unreadCount: notif.unreadCount + 1 }
              : notif,
        );
        return {
          ...oldNotifications,
          notification: {
            ...oldNotifications.notification,
            chatNotifications: updatedChatNotifications,
          },
        };
      } else {
        // Create a new chat notification entry
        const newChatNotification = {
          chat: notificationData.chatId,
          unreadCount: 1,
          _id: uuidv4(), // Generate a unique ID for the new chat notification
        };
        return {
          ...oldNotifications,
          notification: {
            ...oldNotifications.notification,
            chatNotifications: [...chatNotifications, newChatNotification],
          },
        };
      }
    });
  };

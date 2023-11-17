// import React, { useCallback } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   addNotification as addNotificationApi,
//   removeNotification as removeNotificationApi,
//   getAllNotifications as getAllNotificationsApi,
// } from "../api/notification";

// const NotificationContext = React.createContext();

// export const NotificationProvider = ({ children }) => {
//   const queryClient = useQueryClient();
//   const [notifications, setNotifications] = React.useState({});

//   const { data, isLoading, isFetching, isSuccess, refetch } = useQuery({
//     queryKey: ["notifications"],
//     queryFn: getAllNotificationsApi,
//     staleTime: 5 * 60 * 1000,
//     gcTime: 1000 * 60 * 5,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//   });

//   React.useEffect(() => {
//     if (!isLoading && !isFetching && isSuccess) {
//       if (!data.notification) return setNotifications(null);
//       setNotifications(
//         data.notification.chatNotifications.reduce((acc, chatNotif) => {
//           acc[chatNotif.chat] = chatNotif.unreadCount;
//           return acc;
//         }, {}),
//       );
//     }
//   }, [data, isLoading, isSuccess, isFetching]);

//   const addNotificationMutation = useMutation({
//     mutationFn: addNotificationApi,
//     onSuccess: (data) => {
//       console.log("Notification added!", data);
//       setNotifications(
//         data.notification.chatNotifications.reduce((acc, chatNotif) => {
//           acc[chatNotif.chat] = chatNotif.unreadCount;
//           return acc;
//         }, {}),
//       );
//     },
//     onError: (error) => {
//       console.error(error);
//     },
//   });

//   const removeNotificationMutation = useMutation({
//     mutationFn: removeNotificationApi,
//     onSuccess: (data) => {
//       console.log("Notification Removed!");
//       setNotifications(
//         data.notification.chatNotifications.reduce((acc, chatNotif) => {
//           acc[chatNotif.chat] = chatNotif.unreadCount;
//           return acc;
//         }, {}),
//       );
//     },
//     onError: (error) => {
//       console.error(error);
//     },
//   });

//   const addNotification = useCallback(
//     (chatId) => {
//       addNotificationMutation.mutate(chatId);
//     },
//     [addNotificationMutation],
//   );

//   const removeNotification = useCallback(
//     (chatId) => {
//       removeNotificationMutation.mutate(chatId);
//     },
//     [removeNotificationMutation],
//   );

//   const resetNotifications = () => {
//     setNotifications({});
//     queryClient.invalidateQueries({ queryKey: ["notifications"] });
//   };

//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         addNotification,
//         removeNotification,
//         resetNotifications,
//         refetchNotifications: refetch,
//         isLoadingNotifications: isLoading || isFetching,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotification = () => {
//   const context = React.useContext(NotificationContext);
//   if (context === undefined) {
//     throw new Error(
//       "useNotification must be used within a NotificationProvider",
//     );
//   }
//   return context;
// };

// Memoized version of NotificationContext.jsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNotification as addNotificationApi,
  removeNotification as removeNotificationApi,
  getAllNotifications as getAllNotificationsApi,
} from "../api/notification";

const NotificationContext = React.createContext();

export const NotificationProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState({});

  const { data, isLoading, isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: getAllNotificationsApi,
    staleTime: 5 * 60 * 1000,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (isSuccess && data?.notification) {
      const newNotifications = data.notification.chatNotifications.reduce(
        (acc, chatNotif) => {
          acc[chatNotif.chat] = chatNotif.unreadCount;
          return acc;
        },
        {},
      );
      setNotifications(newNotifications);
    }
  }, [data, isSuccess]);

  const updateNotifications = useCallback((notificationData) => {
    setNotifications(
      notificationData.notification.chatNotifications.reduce(
        (acc, chatNotif) => {
          acc[chatNotif.chat] = chatNotif.unreadCount;
          return acc;
        },
        {},
      ),
    );
  }, []);

  const addNotificationMutation = useMutation({
    mutationFn: addNotificationApi,
    onSuccess: updateNotifications,
    onError: (error) => {
      console.error(error);
    },
  });

  const removeNotificationMutation = useMutation({
    mutationFn: removeNotificationApi,
    onSuccess: updateNotifications,
    onError: (error) => {
      console.error(error);
    },
  });

  const addNotification = useCallback(
    (chatId) => addNotificationMutation.mutate(chatId),
    [addNotificationMutation],
  );

  const removeNotification = useCallback(
    (chatId) => removeNotificationMutation.mutate(chatId),
    [removeNotificationMutation],
  );

  const resetNotifications = useCallback(() => {
    setNotifications({});
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  const contextValue = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      resetNotifications,
      refetchNotifications: refetch,
      isLoadingNotifications: isLoading || isFetching,
      updateNotifications,
    }),
    [
      notifications,
      addNotification,
      removeNotification,
      refetch,
      isLoading,
      isFetching,
      resetNotifications,
      updateNotifications,
    ],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};

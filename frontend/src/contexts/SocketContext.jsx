// import React, { useEffect, useContext, createContext, useState } from "react";
// import { connectSocket, disconnectSocket } from "../services/socketService";
// import { useAuth } from "./AuthContext";
// import { useQueryClient } from "@tanstack/react-query";
// import { v4 as uuidv4 } from "uuid";

// const SocketContext = createContext(null);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const { authStatus } = useAuth();
//   const [isConnected, setIsConnected] = useState(false);
//   const queryClient = useQueryClient();

//   // Connect/disconnect the socket when the auth state changes
//   useEffect(() => {
//     if (authStatus === "authenticated") {
//       console.log("Connecting socket due to authentication...");
//       const newSocket = connectSocket();
//       setSocket(newSocket);

//       const handleConnect = () => {
//         console.log("Socket.IO connected!");
//         setIsConnected(true);
//       };

//       const handleDisconnect = () => {
//         console.log("Socket.IO disconnected.");
//         setIsConnected(false);
//       };

//       const handleError = (error) => {
//         console.error("Socket.IO Error:", error);
//         setIsConnected(false);
//       };

//       newSocket.on("connect", handleConnect);
//       newSocket.on("disconnect", handleDisconnect);
//       newSocket.on("error", handleError);

//       return () => {
//         console.log("Disconnecting socket...");
//         disconnectSocket(newSocket);
//         newSocket.off("connect", handleConnect);
//         newSocket.off("disconnect", handleDisconnect);
//         newSocket.off("error", handleError);
//       };
//     } else {
//       if (socket) {
//         console.log("Disconnecting socket due to auth state...");
//         disconnectSocket(socket);
//         setSocket(null);
//       }
//     }
//   }, [authStatus]);

//   // Subsribe to a new chat event
//   useEffect(() => {
//     console.log("Subscribing to newChat event...");
//     const handleNewChat = (data) => {
//       console.log("New chat", data);

//       // Add the new chat to the local state
//       queryClient.setQueryData(["chats"], (old) => {
//         if (Array.isArray(old)) {
//           return [...old, data];
//         } else {
//           queryClient.setQueryData(["chats"], {
//             status: "success",
//             chats: [data],
//           });
//         }
//       });
//     };

//     socket?.on("newChat", handleNewChat);

//     return () => {
//       socket?.off("newChat", handleNewChat);
//     };
//   }, [socket, queryClient]);

//   // Subscribe to the "message" event
//   useEffect(() => {
//     console.log("Subscribing to message event...");
//     // Function to handle incoming messages
//     const handleMessageReceived = async (data) => {
//       console.log("Message received", data);

//       // Update the local state with the new message
//       queryClient.setQueryData(["chatMessages", data.chat], (old) => {
//         if (old) {
//           return { ...old, messages: [...old.messages, data] };
//         }
//         return {
//           status: "success",
//           messages: [data],
//         };
//       });

//       // Update the chat's last message
//       queryClient.setQueryData(["chats"], (old) => {
//         if (Array.isArray(old?.chats)) {
//           const chatIndex = old.chats.findIndex(
//             (chat) => chat._id === data.chat,
//           );
//           if (chatIndex !== -1) {
//             const updatedChats = old.chats.map((chat, index) =>
//               index === chatIndex
//                 ? {
//                     ...chat,
//                     latestMessage: {
//                       _id: data._id,
//                       message: data.message,
//                       createdAt: data.createdAt,
//                     },
//                   }
//                 : chat,
//             );
//             return {
//               ...old,
//               chats: updatedChats,
//             };
//           }
//         }
//         return old;
//       });
//     };

//     socket?.on("message", handleMessageReceived);

//     // Clean up the listener when the component unmounts
//     return () => {
//       socket?.off("message", handleMessageReceived);
//     };
//   }, [socket, queryClient]);

//   // Subscribe to the "newNotification" event
//   useEffect(() => {
//     console.log("Subscribing to newNotification event...");
//     const handleNewNotification = (notificationData) => {
//       console.log("New notification received", notificationData);

//       queryClient.setQueryData(["notifications"], (oldNotifications) => {
//         // Check if the notifications object exists and has a chatNotifications array
//         if (
//           !oldNotifications ||
//           !oldNotifications.notification ||
//           !Array.isArray(oldNotifications.notification.chatNotifications)
//         ) {
//           console.warn("Unexpected notifications format in cache");
//           return {
//             status: "success",
//             notification: {
//               chatNotifications: [],
//             },
//           };
//         }

//         // Find an existing notification for the chat
//         const chatNotifications =
//           oldNotifications.notification.chatNotifications;
//         const existingNotificationIndex = chatNotifications.findIndex(
//           (notif) => notif.chat === notificationData.chatId,
//         );

//         if (existingNotificationIndex !== -1) {
//           // Update the unread count for the existing notification
//           const updatedChatNotifications = chatNotifications.map(
//             (notif, index) =>
//               index === existingNotificationIndex
//                 ? { ...notif, unreadCount: notif.unreadCount + 1 }
//                 : notif,
//           );
//           return {
//             ...oldNotifications,
//             notification: {
//               ...oldNotifications.notification,
//               chatNotifications: updatedChatNotifications,
//             },
//           };
//         } else {
//           // Create a new chat notification entry
//           const newChatNotification = {
//             chat: notificationData.chatId,
//             unreadCount: 1,
//             _id: uuidv4(), // Generate a unique ID for the new chat notification
//           };
//           return {
//             ...oldNotifications,
//             notification: {
//               ...oldNotifications.notification,
//               chatNotifications: [...chatNotifications, newChatNotification],
//             },
//           };
//         }
//       });
//     };

//     socket?.on("newNotification", handleNewNotification);

//     return () => {
//       socket?.off("newNotification", handleNewNotification);
//     };
//   }, [socket, queryClient]);

//   return (
//     <SocketContext.Provider value={{ socket, isConnected }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (context === undefined) {
//     throw new Error("useSocket must be used within a SocketProvider");
//   }
//   return context;
// };
import React, { useEffect, useContext, createContext, useState } from "react";
import { connectSocket, disconnectSocket } from "../services/socketService";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  console.log("SocketContext: useState initialized");
  const { authStatus } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  // Connect/disconnect the socket when the auth state changes
  useEffect(() => {
    console.log("SocketContext: Authenticated - attempting to connect socket");
    if (authStatus === "authenticated") {
      console.log("Connecting socket due to authentication...");
      const newSocket = connectSocket();
      setSocket(newSocket);

      const handleConnect = () => {
        console.log("Socket.IO connected!");
        setIsConnected(true);
      };

      const handlePingPong = () => {
        newSocket.emit("pong");
      };

      const handleDisconnectAck = () => {
        console.log(
          `Disconnection acknowledged by server for socket ${newSocket.id}`,
        );
      };

      const handleDisconnect = () => {
        console.log("Socket.IO disconnected.");
        setIsConnected(false);
        setSocket(null);
      };

      const handleError = (error) => {
        console.error("Socket.IO Error:", error);
        setIsConnected(false);
      };

      newSocket.on("connect", handleConnect);
      newSocket.on("disconnect", handleDisconnect);
      newSocket.on("error", handleError);
      newSocket.on("ping", handlePingPong);
      newSocket.on("disconnect_ack", handleDisconnectAck);

      console.log(
        "SocketContext: Cleanup - disconnecting socket and removing listeners",
      );
      return () => {
        console.log("Disconnecting socket...");
        disconnectSocket(newSocket);
        newSocket.off("connect", handleConnect);
        newSocket.off("disconnect", handleDisconnect);
        newSocket.off("error", handleError);
        newSocket.off("ping", handlePingPong);
        newSocket.off("disconnect_ack", handleDisconnectAck);
      };
    } else {
      if (authStatus === "unauthenticated" && socket) {
        console.log("Disconnecting socket due to auth state...");
        disconnectSocket(socket);
        setSocket(null);
      }
    }
  }, [authStatus]);

  // Subscribe to chat update events

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

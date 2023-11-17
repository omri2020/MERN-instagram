// import React, {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   useEffect,
// } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useUser } from "../features/user/useUser";
// import { getAllUserChats } from "../api/user";

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const { user } = useUser();
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState([]);
//   const [chatUsers, setChatUsers] = useState([]);
//   const [filteredChats, setFilteredChats] = useState([]);
//   const [currentChatId, setCurrentChatId] = useState(null);

//   const { data, isLoading, isFetching, refetch } = useQuery({
//     queryKey: ["chats"],
//     queryFn: getAllUserChats,
//   });

//   const userId = user?._id;

//   useEffect(() => {
//     if (!isLoading) {
//       const newFilteredChats = data?.chats?.map((chat) => {
//         return {
//           _id: chat._id,
//           participants: chat.participants.filter(
//             (participant) => participant._id !== userId,
//           ),
//           latestMessage: chat.latestMessage,
//         };
//       });
//       setFilteredChats(newFilteredChats);
//     }
//   }, [data, isLoading, userId]);

//   const handleSelect = useCallback((user) => {
//     setSelected((prevSelected) => {
//       const isAlreadySelected = prevSelected.some(
//         (item) => item._id === user._id,
//       );
//       return isAlreadySelected
//         ? prevSelected.filter((item) => item._id !== user._id)
//         : [...prevSelected, user];
//     });
//     setSearch("");
//   }, []);

//   const handleRemove = useCallback((user) => {
//     setSelected((prevSelected) =>
//       prevSelected.filter((item) => item._id !== user._id),
//     );
//   }, []);

//   return (
//     <ChatContext.Provider
//       value={{
//         search,
//         setSearch,
//         selected,
//         setSelected,
//         chatUsers,
//         setChatUsers,
//         filteredChats,
//         refetchChats: refetch,
//         isLoading: isLoading || isFetching,
//         handleSelect,
//         handleRemove,
//         setCurrentChatId,
//         currentChatId,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (context === undefined) {
//     throw new Error("useChat must be used within a ChatProvider");
//   }
//   return context;
// };

// Memoized version of ChatContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../features/user/useUser";
import { getAllUserChats } from "../api/user";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);

  const userId = user?._id;

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["chats"],
    queryFn: getAllUserChats,
  });

  useEffect(() => {
    if (data && !isLoading) {
      const newFilteredChats = data.chats
        .filter((chat) => chat.participants.some((p) => p._id === userId))
        .map((chat) => ({
          _id: chat._id,
          participants: chat.participants.filter((p) => p._id !== userId),
          latestMessage: chat.latestMessage,
        }));
      setFilteredChats(newFilteredChats);
    }
  }, [data, isLoading, userId]);

  const handleSelect = useCallback((user) => {
    setSelected((prevSelected) => {
      const isSelected = prevSelected.some((item) => item._id === user._id);
      return isSelected
        ? prevSelected.filter((item) => item._id !== user._id)
        : [...prevSelected, user];
    });
    setSearch("");
  }, []);

  const handleRemove = useCallback((user) => {
    setSelected((prev) => prev.filter((item) => item._id !== user._id));
  }, []);

  const contextValue = React.useMemo(
    () => ({
      search,
      setSearch,
      selected,
      setSelected,
      chatUsers,
      setChatUsers,
      filteredChats,
      refetchChats: refetch,
      isLoading: isLoading || isFetching,
      handleSelect,
      handleRemove,
      setCurrentChatId,
      currentChatId,
    }),
    [
      search,
      selected,
      chatUsers,
      filteredChats,
      isLoading,
      isFetching,
      handleSelect,
      handleRemove,
      currentChatId,
      refetch,
    ],
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

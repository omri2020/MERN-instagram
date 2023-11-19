import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import { useCreateChat } from "./hooks/useCreateChat";
import { useChat } from "../../contexts/ChatContext";
import ChatBoxDefault from "./ChatBoxDefault";
import InboxHeader from "./InboxHeader";
import PageLoader2 from "../../ui/PageLoader2";
import ChatsList from "./ChatsList";

const Inbox = () => {
  const { pathname } = useLocation();
  const chatPattern = /^\/direct\/inbox\/.+$/;
  const isChat = chatPattern.test(pathname);

  const {
    user,
    isLoading: isLoadingUser,
    isFetching: isFetchingUser,
  } = useUserContext();

  const { chatUsers, isLoading: isLoadingChats } = useChat();

  const { createChat, isLoadingChat } = useCreateChat();

  return (
    <div className="grid h-screen w-full grid-cols-4 overflow-y-scroll">
      {(isLoadingUser || isFetchingUser || isLoadingChats) && <PageLoader2 />}
      <div className="col-span-1 h-screen border-r">
        {/* Title section */}
        <InboxHeader
          user={user}
          createChat={createChat}
          isLoadingChat={isLoadingChat}
        />
        {/* Title section */}
        {/* Users section */}
        <ChatsList />
        {/* Users section */}
      </div>
      {/* Chat section */}
      {chatUsers?.length > 0 || isChat ? (
        <Outlet context={[isLoadingChat]} />
      ) : (
        <ChatBoxDefault />
      )}
      {/* Chat section */}
    </div>
  );
};

export default Inbox;

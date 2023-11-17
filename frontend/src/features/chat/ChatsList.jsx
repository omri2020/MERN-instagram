import React from "react";
import { Link } from "react-router-dom";
import { useChat } from "../../contexts/ChatContext";
import { useNotification } from "../../contexts/NotificationContext";
import ChatCard from "./ChatCard";

const ChatsList = () => {
  const { filteredChats, isLoading } = useChat();
  const { notifications, removeNotification } = useNotification();
  if (isLoading) return null;

  return (
    <React.Fragment>
      {filteredChats?.map((chat) =>
        chat.participants.map((participant) => (
          <Link
            to={`/direct/inbox/${chat._id}`}
            key={participant._id}
            onClick={
              notifications[chat._id] > 0
                ? () => removeNotification(chat._id)
                : null
            }
          >
            <ChatCard
              user={participant}
              chatId={chat._id}
              latestMessage={chat.latestMessage}
            />
          </Link>
        )),
      )}
    </React.Fragment>
  );
};

export default ChatsList;

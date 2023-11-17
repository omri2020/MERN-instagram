import React from "react";
import BackendPhoto from "../../components/BackendPhoto";
import { useNotification } from "../../contexts/NotificationContext";

const ChatCard = ({ user, chatId, latestMessage }) => {
  const { notifications } = useNotification();
  const hasNotifications = notifications[chatId] > 0;

  return (
    <div className="flex cursor-pointer items-center px-6 py-1.5 hover:bg-gray-50">
      <BackendPhoto
        folder="users"
        filename={user.photo}
        className="h-14 w-14 rounded-full object-cover"
        alt="user"
      />
      <div className="flex flex-col pl-2">
        <span className={`${hasNotifications ? "font-semibold" : ""}`}>
          {user.name}
        </span>
        <span className="text-xs text-gray-400">
          <span className={`${hasNotifications ? "font-bold text-black" : ""}`}>
            {latestMessage?.message}
          </span>
          <span>&middot;</span> <span>1h</span>
        </span>
      </div>
    </div>
  );
};

export default ChatCard;

import React from "react";
import UserPhoto from "../../components/UserPhoto";
import { useChat } from "../../contexts/ChatContext";

const UserChatDisplayCard = ({ following }) => {
  const { handleSelect } = useChat();
  return (
    <div
      className="flex cursor-pointer items-center justify-between px-4 py-1.5 hover:bg-gray-100"
      onClick={() => handleSelect(following)}
      key={following._id}
    >
      <div
        key={following._id}
        className="flex h-12 cursor-pointer items-center  gap-2"
      >
        <UserPhoto
          src={following.photo}
          alt="user"
          className="h-10 rounded-full object-cover ring-0 ring-offset-0"
          size="medium"
        />
        <span className="text-sm font-semibold">{following.username}</span>
      </div>
      <div className="h-5 w-5 rounded-full border border-gray-300"></div>
    </div>
  );
};

export default UserChatDisplayCard;

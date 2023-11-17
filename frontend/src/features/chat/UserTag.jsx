import React from "react";
import { RxCross1 } from "react-icons/rx";
import { useChat } from "../../contexts/ChatContext";

const UserTag = ({ user }) => {
  const { handleRemove } = useChat();
  return (
    <button
      className="flex items-center rounded-3xl bg-blue-100 px-2 py-1 text-xs font-semibold text-sky-500"
      onClick={() => handleRemove(user)}
    >
      <span>{user.name}</span>
      <span className="ml-1">
        <RxCross1 />
      </span>
    </button>
  );
};

export default UserTag;

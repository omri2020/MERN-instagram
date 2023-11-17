import React from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../../contexts/ChatContext";
import { BsTelephone } from "react-icons/bs";
import { CiVideoOn } from "react-icons/ci";
import { HiOutlineInformationCircle } from "react-icons/hi";
import UserAndPhoto from "../../components/UserAndPhoto";

const MessagesBoxTitle = () => {
  const { chatId } = useParams();

  const { filteredChats } = useChat();

  const participants = filteredChats?.find(
    (chat) => chat._id === chatId,
  )?.participants;

  return (
    <div className="flex h-16 w-full justify-between border-b px-5 py-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        {participants?.map((user, i) => (
          <UserAndPhoto
            key={i}
            userPhoto={user?.photo}
            username={user?.name}
            size="base"
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <BsTelephone size={20} />
        <CiVideoOn size={27} />
        <HiOutlineInformationCircle size={25} />
      </div>
    </div>
  );
};

export default MessagesBoxTitle;

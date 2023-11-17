import React from "react";
import Modal from "../../components/Modal";
import { AiOutlineDown } from "react-icons/ai";
import { HiOutlinePencilAlt } from "react-icons/hi";
import NewChatModal from "./NewChatModal";

const InboxHeader = ({ user, createChat, isLoadingChat }) => {
  return (
    <div className="mt-4 flex flex-col gap-5 p-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span>{user?.username}</span>
          <span className="pt-1">
            <AiOutlineDown size={12} />
          </span>
        </div>
        <Modal.Button opens="start-conversation">
          <HiOutlinePencilAlt size={25} />
        </Modal.Button>
        <Modal.Window name="start-conversation" className="h-3/5 w-1/3">
          <NewChatModal createChat={createChat} isLoadingChat={isLoadingChat} />
        </Modal.Window>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">Messages</span>
        <span className="text-xs font-bold text-gray-400">Requests</span>
      </div>
    </div>
  );
};

export default InboxHeader;

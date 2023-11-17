import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../user/useUser";
import { useChat } from "../../contexts/ChatContext";
import ModalHeader from "./ModalHeader";
import SearchBar from "./SearchBar";
import FollowingsList from "./FollowingsList";
import ChatButton from "./ChatButton";
import { getFollowing } from "../../api/user";

const NewChatModal = ({ closeModal, createChat, isLoadingChat }) => {
  const { search, setSearch, selected, setSelected, setChatUsers } = useChat();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["following"],
    queryFn: getFollowing,
  });
  const { user, isLoading, isFetching } = useUser();

  const followings = data?.data;

  // Filter following based on search
  const filteredFollowings =
    search === ""
      ? []
      : followings?.filter((following) =>
          following.username.toLowerCase().includes(search.toLowerCase()),
        );

  // Create participants array
  const participants = [...selected.map((user) => user?._id), user?._id];

  const newChat = {
    participants: participants,
    isGroupChat: participants.length > 2,
    chatName: "",
  };

  const handleChat = async () => {
    try {
      const createdChat = await createChat(newChat);
      if (createdChat?._id) {
        setChatUsers(selected);
        setSelected([]);
        setSearch("");
        closeModal();
        navigate(`/direct/inbox/${createdChat._id}`);
      }
    } catch (error) {
      console.log("Error creating chat:", error);
    }
  };

  if (isLoading || isFetching || isLoadingChat) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <ModalHeader closeModal={closeModal} />
      <SearchBar search={search} setSearch={setSearch} selected={selected} />
      <FollowingsList followings={filteredFollowings} />
      <ChatButton selected={selected} handleChat={handleChat} />
    </div>
  );
};

export default NewChatModal;

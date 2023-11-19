import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../../contexts/UserContext";
import { usePostSocketListener } from "../../sockets/hooks/usePostSocketListeners";
import { usePostActions } from "./usePostActions";
import { getPost } from "../../api/post";
import * as handlers from "../../sockets/handlers/postUpdateHandlers";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Icon from "../../components/Icon";
import Modal from "../../components/Modal";

const PostCTA = React.memo(function PostCTA({ postId, size, postName }) {
  const { user } = useUserContext();
  const userId = user?._id;
  const { toggleLike } = usePostActions();

  usePostSocketListener(postId, handlers.handleLike, "postLiked");
  usePostSocketListener(postId, handlers.handleUnlike, "postUnliked");

  const { data: post } = useQuery({
    queryKey: ["post", postId],
    queryFn: getPost,
  });

  const isLiked = post?.likes
    ? post.likes.some((like) => like._id === userId)
    : false;

  const onClick = async () => {
    toggleLike(postId, isLiked, userId);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-center gap-4">
        {isLiked ? (
          <AiFillHeart
            size={`${size === "detailed" ? 25 : 30}`}
            className="cursor-pointer text-red-500"
            onClick={onClick}
          />
        ) : (
          <AiOutlineHeart
            size={`${size === "detailed" ? 25 : 30}`}
            className="cursor-pointer"
            onClick={onClick}
          />
        )}
        <Modal.Button opens={postName}>
          <Icon
            src="message-icon.png"
            height={`${size === "detailed" ? 5 : 6}`}
          />
        </Modal.Button>
        <Icon src="share-icon.png" height={`${size === "detailed" ? 5 : 6}`} />
      </div>
      <Icon
        src="collections-icon.png"
        height={`${size === "detailed" ? 5 : 6}`}
      />
    </div>
  );
});

export default PostCTA;

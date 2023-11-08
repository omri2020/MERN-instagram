import { useState } from "react";
import { usePostActions } from "../features/posts/usePostActions";
import { useUser } from "../features/user/useUser";
import { usePostSocketListener } from "../sockets/hooks/usePostSocketListeners";
import { handleNewComment } from "../sockets/handlers/postUpdateHandlers";

export const useCommentForm = (postId) => {
  const [comment, setComment] = useState("");
  const { user } = useUser();
  const { addComment } = usePostActions();

  usePostSocketListener(postId, handleNewComment, "commentAdded");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComment = {
      text: comment,
      user: {
        username: user?.username,
        photo: user?.photo,
      },
    };
    addComment(postId, newComment);
    setComment("");
  };

  return {
    comment,
    setComment,
    handleSubmit,
  };
};

import React from "react";
import { useCommentForm } from "../../hooks/useCommentForm";
import Icon from "../../components/Icon";

const AddCommentForm2 = React.memo(function AddCommentForm2({ postId }) {
  const { comment, setComment, handleSubmit } = useCommentForm(postId);

  return (
    <form
      className="flex items-center gap-1 border-t p-3"
      onSubmit={handleSubmit}
    >
      <Icon src="smiley-icon.png" height={6} />
      <input
        placeholder="Add a comment..."
        className="mr-auto text-sm outline-none"
        onChange={(e) => setComment(e.target.value)}
        value={comment}
      />
      <button
        type="submit"
        className={`text-sm font-semibold text-sky-500 ${
          comment.length === 0 && "opacity-50"
        }`}
      >
        Post
      </button>
    </form>
  );
});

export default AddCommentForm2;

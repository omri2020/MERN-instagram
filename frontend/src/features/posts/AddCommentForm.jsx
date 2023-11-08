import React from "react";
import { useCommentForm } from "../../hooks/useCommentForm";
import Icon from "../../components/Icon";

const AddCommentForm = React.memo(function AddCommentForm({ postId }) {
  const { comment, setComment, handleSubmit } = useCommentForm(postId);

  return (
    <form className="flex justify-between border-b" onSubmit={handleSubmit}>
      <input
        placeholder="Add a comment..."
        className="w-80 resize-none outline-none"
        onChange={(e) => setComment(e.target.value)}
        value={comment}
      />
      <span>
        <Icon src="smiley-icon.png" height={5} />
      </span>
    </form>
  );
});

export default AddCommentForm;

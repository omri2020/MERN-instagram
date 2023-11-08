import React from "react";
import { useUserActions } from "../features/user/useUserActions";

const PostModal = ({ postUserUsername, closeModal }) => {
  const { unfollow, isLoading } = useUserActions();

  return (
    <div className="flex flex-col text-center text-sm [&>*:not(:last-child)]:border-b [&>*]:cursor-pointer [&>*]:py-3">
      <div className="warning">Report</div>
      <button
        onClick={() => {
          unfollow(postUserUsername);
          closeModal();
        }}
        disabled={isLoading}
        className="warning"
      >
        Unfollow
      </button>
      <div>Add to favorites</div>
      <div>Go to post</div>
      <div>Share to</div>
      <div>Copy link</div>
      <div>Embed</div>
      <div>About this account</div>
      <div>Cancel</div>
    </div>
  );
};

export default PostModal;

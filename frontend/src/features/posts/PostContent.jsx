import Modal from "../../components/Modal";
import AddCommentForm from "./AddCommentForm";
import DetailedPost from "./DetailedPost";

function PostContent({ postName, post }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex">
        <div className=" mr-2 font-semibold">{post.user.username}</div>
        <div>{post.caption}</div>
      </div>
      <div>
        <Modal.Button opens={postName}>
          <span className="text-gray-400">
            View all {post.commentCount} comments
          </span>
        </Modal.Button>
        {/*Modal window */}
        <DetailedPost postName={postName} {...post} />
      </div>
      <AddCommentForm postId={post._id} />
    </div>
  );
}

export default PostContent;

import PostCTA from "./PostCTA";
import PostImg from "./PostImg";
import PostMenu from "./PostMenu";
import PostLikes from "./PostLikes";
import PostContent from "./PostContent";

function PostCard({ post, postName }) {
  return (
    <div className="mb-4 flex flex-col gap-3">
      <PostMenu
        username={post.user.username}
        userPhoto={post.user.photo}
        createdAt={post.createdAt}
        postId={post._id}
        postUserUsername={post.user.username}
      />
      <PostImg src={post.photo} />
      <PostCTA postId={post._id} postName={postName} />
      <PostLikes likeCount={post.likeCount} />
      <PostContent post={post} postName={postName} />
    </div>
  );
}

export default PostCard;

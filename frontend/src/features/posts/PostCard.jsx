import PostCTA from "./PostCTA";
import PostImg from "./PostImg";
import PostMenu from "./PostMenu";
import PostLikes from "./PostLikes";
import PostContent from "./PostContent";

function PostCard({ post }) {
  return (
    <div className="flex flex-col gap-3">
      <PostMenu username={post.user.username} userPhoto={post.user.photo} />
      <PostImg src={post.photo} />
      <PostCTA
        isLiked={post.isLiked}
        postId={post._id}
        likeCount={post?.likeCount}
      />
      <PostLikes likes={post.likeCount} />
      <PostContent caption={post.caption} username={post.user.username} />
    </div>
  );
}

export default PostCard;

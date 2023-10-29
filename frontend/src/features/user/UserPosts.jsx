import BackendPhoto from "../../components/BackendPhoto";

function UserPosts({ posts }) {
  return (
    <div className="grid grid-cols-3 gap-x-1 gap-y-1">
      {posts?.map((post, i) => (
        <BackendPhoto
          key={post?._id}
          filename={post?.photo}
          folder="posts"
          alt={`post-${i}`}
          className="w-full"
        />
      ))}
    </div>
  );
}

export default UserPosts;

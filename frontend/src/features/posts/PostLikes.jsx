import UserPhoto from "../../components/UserPhoto";

function PostLikes({ likes }) {
  return (
    <div className="flex items-center">
      <div className="relative flex h-4 w-12 items-center">
        <UserPhoto size="mini" src="user-2.jpg" className="absolute " />
        <UserPhoto size="mini" src="user-3.jpg" className="absolute  ml-3" />
        <UserPhoto size="mini" src="user-4.jpg" className="absolute  ml-6" />
      </div>
      <div className="-ml-1 font-semibold">{likes} likes</div>
    </div>
  );
}

export default PostLikes;

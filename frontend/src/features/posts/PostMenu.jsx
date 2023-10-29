import { Link } from "react-router-dom";
import UserPhoto from "../../components/UserPhoto";

function PostMenu({ username, userPhoto }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-center gap-1.5">
        <UserPhoto size="small" isStory={true} src={userPhoto} />
        <span>
          <Link to={`/${username}`} className="font-semibold">
            {username}
          </Link>
        </span>
        <span className="-mt-1 text-4xl text-gray-500">&middot;</span>
        <span className="text-gray-500">2d</span>
      </div>
      <div className=" -translate-y-1 text-3xl">&middot;&middot;&middot;</div>
    </div>
  );
}

export default PostMenu;

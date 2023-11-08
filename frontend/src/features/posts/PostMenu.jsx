import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import UserPhoto from "../../components/UserPhoto";
import MenuButton from "../../components/MenuButton";
import PostModal from "../../components/PostModal";
import { getPassedTimeCount } from "../../utils/helpers";

function PostMenu({
  username,
  userPhoto,
  createdAt,
  postId,
  postUserUsername,
}) {
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
        <span className="text-gray-500">{getPassedTimeCount(createdAt)}</span>
      </div>
      <div className="-translate-y-1 text-3xl">
        <Modal.Button opens={`postMenu-${postId}`}>
          <MenuButton />
        </Modal.Button>
        <Modal.Window name={`postMenu-${postId}`} className=" w-96">
          <PostModal postUserUsername={postUserUsername} />
        </Modal.Window>
      </div>
    </div>
  );
}

export default PostMenu;

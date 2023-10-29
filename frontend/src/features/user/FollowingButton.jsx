import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { useUserActions } from "./useUserActions";
import UserMenu from "./UserMenu";

function FollowingButton({ photo, username, followed, isUser }) {
  const { followUser, unfollow, isLoading } = useUserActions();

  return followed ? (
    <>
      <Modal.Button className="m-0 w-fit min-w-max rounded-lg bg-gray-200 bg-opacity-80 px-5 py-1.5 text-sm font-semibold text-slate-900 hover:bg-gray-300">
        <div className="flex items-center">
          Following
          <img
            src="/img/icons/down-arrow.svg"
            alt="down-arrow"
            className="h-3 pl-3"
          />
        </div>
      </Modal.Button>

      <Modal.Window className="relative w-[25rem] overflow-hidden">
        <UserMenu photo={photo} username={username} unfollow={unfollow} />
      </Modal.Window>
    </>
  ) : (
    !isUser && (
      <Button
        className="m-0 w-fit min-w-max bg-blue-500 px-5 py-1.5 hover:bg-blue-600"
        onClick={() => followUser(username)}
      >
        Follow
      </Button>
    )
  );
}

export default FollowingButton;

import Button from "../../components/Button";
import FollowingButton from "./FollowingButton";
import MenuButton from "../../components/MenuButton";

function UserActions({ username, photo, followed, isUser, userId }) {
  return (
    <div className="flex items-center gap-2 pb-6">
      <h1 className="mr-6 text-xl">{username}</h1>
      <FollowingButton
        photo={photo}
        username={username}
        followed={followed}
        isUser={isUser}
        userId={userId}
      />
      <Button className="m-0 w-fit bg-gray-200 bg-opacity-80 px-5 py-1.5 text-slate-900 hover:bg-gray-300">
        Message
      </Button>
      <Button className="m-0 w-fit  bg-gray-200 bg-opacity-80 px-3 py-2 hover:bg-gray-300">
        <img
          src="public/img/icons/add-friend.png"
          alt="add-friend"
          className="h-3.5"
        />
      </Button>
      <button className="bg-transparent pl-4">
        <MenuButton />
      </button>
    </div>
  );
}

export default UserActions;

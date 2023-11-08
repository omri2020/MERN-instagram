import BackendPhoto from "../../components/BackendPhoto";

function UserMenu({
  closeModal,
  username,
  userId,
  photo,
  unfollow,
  isLoading,
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col items-center gap-1.5 border-b py-4">
        <BackendPhoto
          filename={photo}
          folder="users"
          alt="user"
          className="h-14 rounded-full"
        />
        <span className="text-sm font-semibold">{username}</span>
      </div>
      <div className="flex h-full flex-col items-stretch justify-between text-sm [&>*]:cursor-pointer [&>*]:p-4 hover:[&>*]:bg-gray-100">
        <div>Add to close friends list</div>
        <div>Add to favorites</div>
        <div>Mute</div>
        <div>Restrict</div>
        <button
          className="w-full text-left"
          onClick={() => {
            unfollow(username, userId);
            closeModal();
          }}
          disabled={isLoading}
        >
          Unfollow
        </button>
      </div>
    </div>
  );
}

export default UserMenu;

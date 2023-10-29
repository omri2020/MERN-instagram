import BackendPhoto from "../../components/BackendPhoto";

function UserMenu({ closeModal, username, photo, unfollow }) {
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
      <div className="flex h-full flex-col justify-between text-sm [&>*]:cursor-pointer [&>*]:p-4 hover:[&>*]:bg-gray-100">
        <div>Add to close friends list</div>
        <div>Add to favorites</div>
        <div>Mute</div>
        <div>Restrict</div>
        <div
          onClick={() => {
            unfollow(username);
            closeModal();
          }}
        >
          Unfollow
        </div>
      </div>
    </div>
  );
}

export default UserMenu;

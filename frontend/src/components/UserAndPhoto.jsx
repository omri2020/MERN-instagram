import BackendPhoto from "./BackendPhoto";

function UserAndPhoto({ username, userPhoto }) {
  return (
    <div className="flex items-center gap-3">
      <div>
        <BackendPhoto
          filename={userPhoto}
          folder="users"
          className="h-8 w-8 rounded-full"
        />
      </div>
      <div>
        <span className="text-sm font-semibold">{username}</span>
      </div>
    </div>
  );
}

export default UserAndPhoto;

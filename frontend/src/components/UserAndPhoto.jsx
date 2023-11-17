import BackendPhoto from "./BackendPhoto";

const sizes = {
  small: "h-8 w-8",
  base: "h-10 w-10",
  medium: "h-12 w-12",
  large: "h-16 w-16",
};

function UserAndPhoto({ username, userPhoto, size }) {
  return (
    <div className="flex items-center gap-3">
      <div>
        <BackendPhoto
          filename={userPhoto}
          folder="users"
          className={`${sizes[size] || "h-12 w-12"} rounded-full`}
        />
      </div>
      <div>
        <span className="text-sm font-semibold">{username}</span>
      </div>
    </div>
  );
}

export default UserAndPhoto;

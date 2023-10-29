import BackendPhoto from "../../components/BackendPhoto";

function UserProfilePicture({ photo }) {
  return (
    <BackendPhoto
      filename={photo}
      alt="profile"
      folder="users"
      className="m-16 h-40 w-40 rounded-full ring-2 ring-gray-200 ring-offset-4"
    />
  );
}

export default UserProfilePicture;

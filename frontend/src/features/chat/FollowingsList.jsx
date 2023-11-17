import UserChatDisplayCard from "./UserChatDisplayCard";

const FollowingsList = ({ followings }) => (
  <div className="my-2 h-full overflow-y-scroll">
    {followings?.length === 0 ? (
      <span className="pl-4 text-sm text-gray-600">No account found.</span>
    ) : (
      followings?.map((following) => (
        <UserChatDisplayCard key={following._id} following={following} />
      ))
    )}
  </div>
);

export default FollowingsList;

import { useLoaderData } from "react-router-dom";
import { getUser } from "../../api/user";
import { useCurrentUser } from "./useCurrentUser";
import UserProfilePicture from "./UserProfilePicture";
import UserActions from "./UserActions";
import UserStats from "./UserStats";
import UserPosts from "./UserPosts";

function Profile() {
  const { data: currentUser, isLoading } = useCurrentUser();
  const { user } = useLoaderData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isFollowed = currentUser?.following?.includes(user?._id);
  const isUser = currentUser?._id === user?._id;

  return (
    <div className="my-10 flex w-full justify-center">
      <div className="flex w-[60rem] max-w-[60rem] flex-col">
        <div className="flex">
          <UserProfilePicture photo={user?.photo} />
          <div className="flex flex-col pl-10">
            <UserActions
              followed={isFollowed}
              username={user?.username}
              photo={user?.photo}
              isUser={isUser}
            />
            <UserStats
              stats={{
                posts: user?.posts.length,
                followers: user?.followers.length,
                following: user?.following.length,
              }}
            />
            <p>{user?.bio}</p>
          </div>
        </div>
        <UserPosts posts={user?.posts} />
        {/* ADDITIONAL COMPONENTS */}
        {/* 1. User Posts */}
        {/* 2. User Followers */}
        {/* 3. User Following */}
        {/* 4. User Bio */}
        {/* 5. User Actions */}
      </div>
    </div>
  );
}

export function profileLoader({ params }) {
  return getUser(params.username);
}

export default Profile;

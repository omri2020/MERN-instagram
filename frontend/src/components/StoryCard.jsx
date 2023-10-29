import UserPhoto from "./UserPhoto";

function StoryCard({ size, isStory }) {
  return (
    <div className="flex flex-col items-center justify-center ">
      <UserPhoto size={size} isStory={isStory} src="user-1.jpg" />
      <div>alexander.hipp</div>
    </div>
  );
}

export default StoryCard;

function UserStats({ stats }) {
  return (
    <div className="flex gap-10">
      <span>
        <span className="font-semibold">{stats.posts}</span> posts
      </span>
      <span>
        <span className="font-semibold">{stats.followers}</span> followers
      </span>
      <span>
        <span className="font-semibold">{stats.following}</span> following
      </span>
    </div>
  );
}

export default UserStats;

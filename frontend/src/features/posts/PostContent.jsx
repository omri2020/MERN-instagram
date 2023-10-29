function PostContent({ username, caption }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex">
        <div className=" mr-2 font-semibold">{username}</div>
        <div>{caption}</div>
      </div>
      <div>
        <span className="text-gray-400">View all 368 comments</span>
      </div>
      <div className="flex justify-between border-b">
        <textarea
          placeholder="Add a comment..."
          className="w-80 resize-none outline-none"
        />
        <span>
          <img
            src="/img/icons/smiley-icon.png"
            alt="smiley-icon"
            className="h-5"
          />
        </span>
      </div>
    </div>
  );
}

export default PostContent;

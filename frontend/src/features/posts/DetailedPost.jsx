import Modal from "../../components/Modal";
import BackendPhoto from "../../components/BackendPhoto";
import UserAndPhoto from "../../components/UserAndPhoto";
import MenuButton from "../../components/MenuButton";
import PostCTA from "./PostCTA";
import { getMonthAndDay, getPassedTimeCount } from "../../utils/helpers";
import AddCommentForm2 from "./AddCommentForm2";

function DetailedPost({
  postName,
  _id,
  photo,
  user,
  comments,
  likeCount,
  createdAt,
}) {
  return (
    <Modal.Window
      name={postName}
      className="h-[95%] max-h-[95%] w-4/5 rounded-none"
    >
      <div className="flex h-full w-full">
        <div className="h-full w-4/6">
          <BackendPhoto
            filename={photo}
            folder="posts"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex w-2/6 flex-col">
          <div className="flex w-full items-center justify-between border-b px-4 py-3">
            <UserAndPhoto username={user?.username} userPhoto={user?.photo} />
            <Modal.Button opens="post-menu">
              <MenuButton />
            </Modal.Button>
            <Modal.Window name="post-menu">
              <div>just some text that needs to be replaced</div>
            </Modal.Window>
          </div>
          <div className="no-scrollbar h-[81.5%] overflow-auto">
            {comments?.length > 0 &&
              comments.map((comment) => (
                <div
                  key={comment?._id}
                  className="flex items-center gap-1.5 px-4 py-3"
                >
                  <UserAndPhoto
                    username={comment?.user?.username} // Use optional chaining here
                    userPhoto={comment?.user?.photo} // And here as well
                  />
                  <div className="mr-auto">{comment?.text}</div>
                  <div className="text-xs text-gray-600">
                    {getPassedTimeCount(comment?.createdAt)}
                  </div>
                </div>
              ))}
          </div>
          <div className="border-t p-4">
            <PostCTA postId={_id} size="detailed" />
            <div className="pt-2 text-sm font-semibold">{likeCount} likes</div>
            <div className="text-xs text-gray-500">
              {getMonthAndDay(createdAt)}
            </div>
          </div>
          <AddCommentForm2 postId={_id} />
        </div>
      </div>
    </Modal.Window>
  );
}

export default DetailedPost;

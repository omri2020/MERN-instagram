import React from "react";
import Modal from "../../components/Modal";
import BackendPhoto from "../../components/BackendPhoto";
import DetailedPost from "../posts/DetailedPost";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";

function UserPosts({ posts }) {
  return (
    <div className="grid grid-cols-3 gap-x-1 gap-y-1">
      {posts?.map((post, i) => (
        <React.Fragment key={post._id}>
          <Modal.Button className="w-full" opens={post?._id}>
            <div className="relative z-0 after:absolute after:inset-0 after:bg-black after:bg-opacity-0 hover:after:bg-opacity-30 [&>*]:hover:opacity-100">
              <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-5 text-lg font-bold text-white opacity-0">
                <span className="flex items-center gap-1">
                  <AiFillHeart size={20} /> {post?.likeCount}
                </span>
                <span className="flex items-center gap-1">
                  <FaComment />
                  {post?.commentCount}
                </span>
              </div>
              <BackendPhoto
                filename={post?.photo}
                folder="posts"
                alt={`post-${i}`}
                className="w-full"
              />
            </div>{" "}
          </Modal.Button>
          <DetailedPost postName={post?._id} {...post} />
        </React.Fragment>
      ))}
    </div>
  );
}

export default UserPosts;

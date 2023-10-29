// import React from "react";
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
// import Icon from "../../components/Icon";
// import { usePostActions } from "../posts/usePostActions";
// import { usePostSocketListeners } from "../../hooks/usePostSocketListeners";

// function PostCTA({ isLiked, postId, likesCount }) {
//   usePostSocketListeners(postId); // This listens to like/unlike events from other users
//   const { toggleLike, isLoading } = usePostActions();

//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex items-center justify-center gap-4">
//         {isLiked ? (
//           <AiFillHeart
//             size={30}
//             className="cursor-pointer text-red-500"
//             onClick={() => toggleLike(postId, isLiked)}
//             disabled={isLoading}
//           />
//         ) : (
//           <AiOutlineHeart
//             size={30}
//             className="cursor-pointer"
//             onClick={() => toggleLike(postId, isLiked)}
//             disabled={isLoading}
//           />
//         )}
//         <span>{likesCount}</span>
//         <Icon src="message-icon" />
//         <Icon src="share-icon" />
//       </div>
//       <Icon src="collections-icon" />
//     </div>
//   );
// }

// export default PostCTA;
import { usePostActions } from "../posts/usePostActions";

function PostCTA({ isLiked, postId, likeCount }) {
  const { toggleLike } = usePostActions();

  const onClick = () => {
    console.log("Button Clicked: ", isLiked);
    toggleLike(postId, isLiked);
  };

  return (
    <button onClick={onClick}>
      {isLiked ? "Liked" : "Not Liked"} - {likeCount}
    </button>
  );
}

export default PostCTA;

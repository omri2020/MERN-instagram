import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../hooks/useSocket";
import { toggleLike as toggleLikeApi } from "../../api/post";

// export const usePostActions = () => {
//   const socket = useSocket();
//   const queryClient = useQueryClient();

//   const toggleLike = useCallback(
//     async (postId, isLiked) => {
//       try {
//         // Optimistically update the UI
//         const previousPost = queryClient.getQueryData(["post", postId]);
//         queryClient.setQueryData(["post", postId], {
//           ...previousPost,
//           isLiked: !isLiked,
//           likesCount: isLiked
//             ? previousPost.likesCount - 1
//             : previousPost.likesCount + 1,
//         });

//         // Make the API call to toggle like/unlike
//         const updatedPost = await toggleLikeApi(postId);

//         // Update the cache with the response from the server
//         queryClient.setQueryData(["post", postId], updatedPost);

//         // Emit the socket event
//         socket.emit(isLiked ? "postUnliked" : "postLiked", { postId });
//       } catch (error) {
//         console.error("Error toggling like:", error);
//         // If there was an error, roll back the optimistic update
//         queryClient.invalidateQueries(["post", postId]);
//       }
//     },
//     [socket, queryClient],
//   );

//   return { toggleLike };
// };

export const usePostActions = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const toggleLike = useCallback(
    async (postId, isLiked) => {
      console.log("Toggling Like: ", isLiked);

      // Optimistic update
      const previousPost = queryClient.getQueryData(["post", postId]);
      queryClient.setQueryData(["post", postId], {
        ...previousPost,
        isLiked: !isLiked,
        likeCount: isLiked
          ? previousPost?.likeCount - 1
          : previousPost?.likeCount + 1,
      });

      try {
        const updatedPost = await toggleLikeApi(postId);
        console.log("Updated Post from API: ", updatedPost);
        queryClient.setQueryData(["post", postId], updatedPost);
      } catch (error) {
        console.error("Error toggling like:", error);
        // Revert back to previous state in case of error
        queryClient.setQueryData(["post", postId], previousPost);
      }

      socket.emit(isLiked ? "postUnliked" : "postLiked", { postId });
    },
    [socket, queryClient],
  );

  return { toggleLike };
};

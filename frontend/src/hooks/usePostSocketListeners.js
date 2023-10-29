import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "./useSocket";

// export const usePostSocketListeners = (postId) => {
//   const socket = useSocket();
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const handleLike = (data) => {
//       if (data.postId === postId) {
//         const previousPost = queryClient.getQueryData(["post", postId]);
//         queryClient.setQueryData(["post", postId], {
//           ...previousPost,
//           isLiked: true,
//           likesCount: previousPost.likesCount + 1,
//         });
//       }
//     };

//     const handleUnlike = (data) => {
//       if (data.postId === postId) {
//         const previousPost = queryClient.getQueryData(["post", postId]);
//         queryClient.setQueryData(["post", postId], {
//           ...previousPost,
//           isLiked: false,
//           likesCount: previousPost.likesCount - 1,
//         });
//       }
//     };

//     socket.on("postLiked", handleLike);
//     socket.on("postUnliked", handleUnlike);

//     return () => {
//       socket.off("postLiked", handleLike);
//       socket.off("postUnliked", handleUnlike);
//     };
//   }, [socket, queryClient, postId]);
// };

export const usePostSocketListeners = (postId) => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleLike = (data) => {
      console.log("Socket Event - Liked: ", data);
      if (data.postId === postId) {
        const previousPost = queryClient.getQueryData(["post", postId]);
        queryClient.setQueryData(["post", postId], {
          ...previousPost,
          isLiked: true,
          likeCount: previousPost?.likeCount + 1,
        });
      }
    };

    const handleUnlike = (data) => {
      console.log("Socket Event - Unliked: ", data);
      if (data.postId === postId) {
        const previousPost = queryClient.getQueryData(["post", postId]);
        queryClient.setQueryData(["post", postId], {
          ...previousPost,
          isLiked: false,
          likeCount: previousPost?.likeCount - 1,
        });
      }
    };

    socket.on("postLiked", handleLike);
    socket.on("postUnliked", handleUnlike);

    return () => {
      socket.off("postLiked", handleLike);
      socket.off("postUnliked", handleUnlike);
    };
  }, [socket, queryClient, postId]);
};

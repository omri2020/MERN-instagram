import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  toggleLike as toggleLikeApi,
  addComment as addCommentApi,
} from "../../api/post";
import { useUser } from "../user/useUser";

export const usePostActions = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const updateFeedOptimistically = useCallback(
    (postId, updateFn) => {
      const feedQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["userFeed"] });
      feedQueries.forEach((query) => {
        const oldData = query.state.data;
        if (oldData) {
          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post._id === postId ? updateFn(post) : post,
            ),
          }));
          queryClient.setQueryData(query.queryKey, {
            ...oldData,
            pages: updatedPages,
          });
        }
      });
    },
    [queryClient],
  );

  const toggleLike = useCallback(
    async (postId, isLiked) => {
      const userId = user?._id;
      if (!userId) return;

      const previousPost = queryClient.getQueryData(["post", postId]);
      if (!previousPost) return;

      const updateFn = (post) => ({
        ...post,
        likes: isLiked
          ? post.likes.filter((like) => like._id !== userId)
          : [...post.likes, { _id: userId }],
        likeCount: post.likeCount + (isLiked ? -1 : 1),
      });

      // Optimistic updates for ["post", postId] and ["userFeed"]
      queryClient.setQueryData(["post", postId], updateFn(previousPost));
      updateFeedOptimistically(postId, updateFn);

      try {
        const { data: updatedPost } = await toggleLikeApi(postId);
        queryClient.setQueryData(["post", postId], updatedPost);
        updateFeedOptimistically(postId, () => updatedPost);
      } catch (error) {
        console.error("Error toggling like:", error);
        // Roll back optimistic updates if there was an error
        queryClient.setQueryData(["post", postId], previousPost);
        updateFeedOptimistically(postId, () => previousPost);
      }
    },
    [queryClient, user, updateFeedOptimistically],
  );

  const addComment = useCallback(
    async (postId, comment) => {
      const userId = user?._id;
      if (!userId) return;

      const previousPost = queryClient.getQueryData(["post", postId]);
      if (!previousPost) return;

      const updateFn = (post) => ({
        ...post,
        commentCount: post.commentCount + 1,
        comments: [...post.comments, comment],
      });

      // Optimistic updates for ["post", postId] and ["userFeed"]
      queryClient.setQueryData(["post", postId], updateFn(previousPost));
      updateFeedOptimistically(postId, updateFn);

      try {
        const { post: updatedPost } = await addCommentApi(postId, {
          text: comment.text,
        });
        queryClient.setQueryData(["post", postId], updatedPost);
        updateFeedOptimistically(postId, () => updatedPost);
      } catch (error) {
        console.error("Error adding comment", error);

        // Roll back optimistic update if there was an error
        if (previousPost) {
          queryClient.setQueryData(["post", postId], previousPost);
        }
        updateFeedOptimistically(postId, () => previousPost);
      }
    },
    [queryClient, user, updateFeedOptimistically],
  );

  return { toggleLike, addComment };
};

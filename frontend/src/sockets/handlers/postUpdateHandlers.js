export const handleLike = (queryClient, postId) => (data) => {
  const { postId: likedPostId, userId } = data;
  if (likedPostId !== postId) return;

  console.log(
    "In handleLike Before Update:",
    queryClient.getQueryData(["userFeed"]),
  );

  const feedQueries = queryClient
    .getQueryCache()
    .findAll({ queryKey: ["userFeed"] });

  feedQueries.forEach((query) => {
    const oldData = query.state.data;

    if (oldData) {
      const updatedPages = oldData.pages.map((page) => ({
        ...page,
        posts: page.posts.map((post) =>
          post._id === likedPostId
            ? {
                ...post,
                likeCount: post.likeCount + 1,
                likes: [...post.likes, { _id: userId }],
              }
            : post,
        ),
      }));

      queryClient.setQueryData(query.queryKey, {
        ...oldData,
        pages: updatedPages,
      });
      console.log(
        "In handleLike After Update:",
        queryClient.getQueryData(["userFeed"]),
      );
    }
  });
};

export const handleUnlike = (queryClient, postId) => (data) => {
  const { postId: unlikedPostId, userId } = data;
  if (unlikedPostId !== postId) return;
  console.log(
    "In handleUnlike Before Update:",
    queryClient.getQueryData(["userFeed"]),
  );
  const feedQueries = queryClient
    .getQueryCache()
    .findAll({ queryKey: ["userFeed"] });

  feedQueries.forEach((query) => {
    const oldData = query.state.data;

    if (oldData) {
      const updatedPages = oldData.pages.map((page) => ({
        ...page,
        posts: page.posts.map((post) =>
          post._id === unlikedPostId
            ? {
                ...post,
                likeCount: post.likeCount - 1,
                likes: post.likes.filter((like) => like._id !== userId), // This is a new line
              }
            : post,
        ),
      }));

      queryClient.setQueryData(query.queryKey, {
        ...oldData,
        pages: updatedPages,
      });
      console.log(
        "In handleUnlike After Update:",
        queryClient.getQueryData(["userFeed"]),
      );
    }
  });
};

export const handleNewComment = (queryClient, postId) => (data) => {
  const { postId: commentedPostId, newComment } = data;
  if (commentedPostId !== postId) return;

  const previousPost = queryClient.getQueryData(["post", postId]);
  const optimisticUpdate = previousPost && {
    ...previousPost,
    commentCount: previousPost.commentCount + 1,
    comments: [...previousPost.comments, newComment],
  };
  if (optimisticUpdate) {
    queryClient.setQueryData(["post", postId], optimisticUpdate);
  }

  const feedQueries = queryClient
    .getQueryCache()
    .findAll({ queryKey: ["userFeed"] });
  feedQueries.forEach((query) => {
    const oldData = query.state.data;
    if (oldData) {
      const updatedPages = oldData.pages.map((page) => ({
        ...page,
        posts: page.posts.map((post) =>
          post._id === postId ? optimisticUpdate || post : post,
        ),
      }));
      queryClient.setQueryData(query.queryKey, {
        ...oldData,
        pages: updatedPages,
      });
    }
  });
};

import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost as createPostApi } from "../../../api/post";

export const useCreatePost = (setCurrentPhoto) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createPostApi,
    onSuccess: (data) => {
      console.log("Post created successfully");
      queryClient.invalidateQueries(["userFeed"]);
      navigate("/");
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const createPost = async (post) => {
    createMutation.mutate(post);
    setCurrentPhoto(null);
  };

  return {
    createPost,
    isCreating: createMutation.isPending,
    errorCreating: createMutation.isError,
  };
};

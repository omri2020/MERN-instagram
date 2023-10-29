import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadPhoto as uploadPhotoApi } from "../../api/post";
import { deletePhoto as deletePhotoApi } from "../../api/post";
import { createPost as createPostApi } from "../../api/post";
import { useNavigate } from "react-router-dom";

export function useUploadPost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPhoto, setCurrentPhoto] = useState(null);

  const uploadMutation = useMutation({
    mutationFn: uploadPhotoApi,
    onSuccess: (data) => {
      console.log("Photo uploaded successfully");
      setCurrentPhoto(data.filename); // Assuming the API response contains the photo.
    },
    onError: (error) => {
      console.log(error.message);
      setCurrentPhoto(null);
    },
  });

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

  const deleteMutation = useMutation({
    mutationFn: deletePhotoApi,
    onSuccess: (data) => {
      console.log("Photo deleted successfully");
      setCurrentPhoto(null);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const uploadPhoto = async (photo) => {
    uploadMutation.mutate(photo);
  };

  const createPost = async (post) => {
    createMutation.mutate(post);
    setCurrentPhoto(null);
  };

  const deletePhoto = async (fileName) => {
    deleteMutation.mutate(fileName);
  };

  return {
    uploadPhoto,
    deletePhoto,
    createPost,
    isLoading:
      uploadMutation.isLoading ||
      deleteMutation.isLoading ||
      createMutation.isLoading,
    error: uploadMutation.error || deleteMutation.error || createMutation.error,
    currentPhoto,
  };
}

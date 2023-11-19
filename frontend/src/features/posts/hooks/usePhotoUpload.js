import { useMutation } from "@tanstack/react-query";
import { uploadPhoto as uploadPhotoApi } from "../../../api/post";

export const usePhotoUpload = (setCurrentPhoto) => {
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

  const uploadPhoto = async (photo) => {
    uploadMutation.mutate(photo);
  };

  return {
    uploadPhoto,
    isUploading: uploadMutation.isPending,
    errorUploading: uploadMutation.isError,
  };
};

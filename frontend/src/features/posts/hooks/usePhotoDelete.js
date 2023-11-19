import { useMutation } from "@tanstack/react-query";
import { deletePhoto as deletePhotoApi } from "../../../api/post";

export const usePhotoDelete = (setCurrentPhoto) => {
  const deleteMutation = useMutation({
    mutationFn: deletePhotoApi,
    onSuccess: () => {
      console.log("Photo deleted successfully");
      setCurrentPhoto(null);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const deletePhoto = async (fileName) => {
    deleteMutation.mutate(fileName);
  };

  return {
    deletePhoto,
    isDeleting: deleteMutation.isPending,
    errorDeleting: deleteMutation.isError,
  };
};

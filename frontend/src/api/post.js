import API from "./index";
import catchAsync from "../utils/catchAsync";

export const createPost = async (post) => {
  try {
    const res = await API.post("/posts", post);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const uploadPhoto = async (photo) => {
  try {
    const formData = new FormData();
    formData.append("photo", photo);
    const res = await API.post("/posts/upload-photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletePhoto = async (fileName) => {
  try {
    const res = await API.delete("/posts/delete-photo", fileName, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const toggleLike = catchAsync(async (postId) => {
  const res = await API.patch(`/posts/${postId}/toggle-like`);
  return res.data;
});

import API from "./index";
import catchAsync from "../utils/catchAsync";

export const getPost = async ({ queryKey }) => {
  const [, postId] = queryKey;
  const res = await API.get(`/posts/${postId}`);
  const data = res.data.post;
  return data;
};

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

export const addComment = catchAsync(async (postId, comment) => {
  const res = await API.post(`/posts/${postId}/comment`, comment);
  return res.data;
});

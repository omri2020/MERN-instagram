import axios from "axios";
import API from "./index";
import catchAsync from "../utils/catchAsync";

export const getUsers = catchAsync(async () => {
  const res = await API.get("/users");
  return res.data;
});

export const getCurrentUser = catchAsync(async () => {
  const res = await API.get("/users/me");
  return res.data;
});

// export const getFeed = catchAsync(async ({ pageParam, signal }) => {
//   const res = await API.get(`/users/feed?offset=${pageParam}`, { signal });
//   const data = res.data;
//   return { ...data, prevOffSet: pageParam, postCount: data.total };
// });

export const getFeed = catchAsync(async ({ pageParam, signal }) => {
  try {
    const res = await API.get(`/users/feed?offset=${pageParam}`, { signal });
    const data = res.data;
    return { ...data, prevOffSet: pageParam, postCount: data.total };
  } catch (error) {
    if (axios.isCancel(error)) {
      // Request was canceled
      console.log("Request was canceled:", error.message);
      // Optionally, you can rethrow the cancellation error or handle it differently
      throw error;
    } else {
      // Handle other errors
      console.error("An error occurred:", error);
      throw error; // Rethrow the error for further handling or propagation
    }
  }
});

export const getUser = catchAsync(async (username) => {
  const res = await API.get(`/users/${username}`);
  return res.data;
});

export const followNewUser = catchAsync(async (username) => {
  const res = await API.patch(`/users/follow/${username}`);
  return res.data;
});

export const unfollow = catchAsync(async (username) => {
  const res = await API.patch(`/users/unfollow/${username}`);
  return res.data;
});

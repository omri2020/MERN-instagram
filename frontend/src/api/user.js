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

export const getFeed = catchAsync(async ({ pageParam, signal }) => {
  console.log("getFeed called", { pageParam, signal });

  const res = await API.get(`/users/feed?offset=${pageParam}`, { signal });
  const data = res.data;
  return { ...data, prevOffSet: pageParam, postCount: data.total };
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

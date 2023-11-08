import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followNewUser, unfollow as unfollowApi } from "../../api/user";

export function useUserActions() {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: followNewUser,
    onSuccess: () => {
      console.log("followed user");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const followUser = async (username, userId) => {
    console.log("Attempting to follow user:", username);
    try {
      queryClient.setQueryData(["currentUser"], (oldData) => {
        // Make sure oldData is in the expected shape
        if (!oldData) {
          throw new Error("Unexpected oldData shape");
        }
        const newData = {
          ...oldData,
          user: {
            ...oldData.user,
            following: [...(oldData.user.following || []), userId], // Ensure oldData.user.following is an array
          },
        };
        return newData;
      });
      followMutation.mutate(username);
    } catch (error) {
      console.error("Error during optimistic update:", error);
    }
  };

  const unfollowMutation = useMutation({
    mutationFn: unfollowApi,
    onSuccess: () => {
      console.log("unfollowed user");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const unfollow = async (username, userId) => {
    console.log("Attempting to unfollow user:", username);
    try {
      queryClient.setQueryData(["currentUser"], (oldData) => {
        // Make sure oldData is in the expected shape
        if (!oldData) {
          throw new Error("Unexpected oldData shape");
        }
        const newData = {
          ...oldData,
          user: {
            ...oldData.user,
            following: oldData.user.following.filter((id) => id !== userId),
          },
        };
        return newData;
      });
      unfollowMutation.mutate(username);
    } catch (error) {
      console.error("Error during optimistic update:", error);
    }
  };

  return {
    followUser,
    unfollow,
    isLoading:
      followMutation.status === "pending" ||
      unfollowMutation.status === "pending",
    errorFollowing: followMutation.isError || unfollowMutation.isError,
  };
}

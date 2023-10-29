import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followNewUser, unfollow as unfollowApi } from "../../api/user";

export function useUserActions() {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: followNewUser,
    onSuccess: () => {
      console.log("followed user");
      queryClient.invalidateQueries(["feed"]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const followUser = (username) => {
    followMutation.mutate(username);
  };

  const unfollowMutation = useMutation({
    mutationFn: unfollowApi,
    onSuccess: () => {
      console.log("unfollowed user");
      queryClient.invalidateQueries(["feed"]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const unfollow = (username) => {
    unfollowMutation.mutate(username);
  };

  return {
    followUser,
    unfollow,
    isLoading: followMutation.isLoading || unfollowMutation.isLoading,
    errorFollowing: followMutation.isError || unfollowMutation.isError,
  };
}

import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => {
      return queryClient.getQueryData(["currentUser"]) || {};
    },
  });
};

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "../../contexts/SocketContext";
import { getFeed } from "../../api/user";

export function useFeed() {
  const { isConnected } = useSocket();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["userFeed"],
      queryFn: ({ pageParam = 0, signal }) => getFeed({ pageParam, signal }),
      getNextPageParam: (lastPage) => {
        if (!lastPage) return undefined;
        return lastPage.nextPage;
      },
      enabled: isConnected,
      throwOnError: true,
    });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading };
}

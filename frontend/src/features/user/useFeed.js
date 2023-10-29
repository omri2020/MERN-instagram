import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed } from "../../api/user";

export function useFeed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["userFeed"],
      queryFn: ({ pageParam = 0, signal }) => getFeed({ pageParam, signal }),
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage;
      },
      throwOnError: true,
    });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading };
}

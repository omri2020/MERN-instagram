import { useRef, useCallback } from "react";

export function useInfiniteScroll({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) {
  const intObserver = useRef();

  const lastElementRef = useCallback(
    (element) => {
      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (element) intObserver.current.observe(element);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  );

  const items = data?.pages.reduce((acc, page) => {
    return [...acc, ...page.posts];
  }, []);

  return { lastElementRef, items };
}

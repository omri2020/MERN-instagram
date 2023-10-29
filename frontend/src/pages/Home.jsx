import { useFeed } from "../features/user/useFeed";
import { useSocketListeners } from "../hooks/useSocketListeners";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import PostCard from "../features/posts/PostCard";
import StoryCard from "../components/StoryCard";
import PageLoader from "../ui/PageLoader";

function Home() {
  useSocketListeners();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFeed();

  const { lastElementRef, items } = useInfiniteScroll({
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex min-h-screen w-full justify-center">
      <section className="flex min-w-[60rem] flex-col pt-10">
        <div className="mb-10 flex items-center justify-between">
          <StoryCard isStory={true} />
        </div>
        <div className="w-fit self-center">
          {items?.map((post, index) => (
            <div
              ref={items.length === index + 1 ? lastElementRef : null}
              key={post._id}
            >
              <PostCard post={post} />
            </div>
          ))}
          {isFetchingNextPage ? (
            <p>Loading more posts...</p>
          ) : (
            <p>End of the feed</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;

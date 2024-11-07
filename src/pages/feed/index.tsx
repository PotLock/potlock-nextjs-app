import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import InfiniteScrollWrapper from "react-infinite-scroll-component";

import { indexer } from "@/common/api/indexer";
import { fetchGlobalFeeds } from "@/common/api/near-social";
import { POTLOCK_REGISTRY_LIST_ID } from "@/common/constants";
import { cn } from "@/common/ui/utils";
import { FeedCard } from "@/modules/profile";

export default function GlobalFeedsPage() {
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(40);

  const { data: registrations = [] } = indexer.useListRegistrations({
    listId: POTLOCK_REGISTRY_LIST_ID,
    page_size: 999,
  });

  const accountIds = useMemo(
    () => registrations.map(({ registrant }) => registrant.id),
    [registrations],
  );

  useEffect(() => {
    setIsLoading(true);

    fetchGlobalFeeds({ accountIds })
      .then((posts) => {
        setLoadingMore(false);
        setFeedPosts(posts);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Unable to fetch feeds:", err);
      });
  }, [accountIds]);

  const loadMorePosts = useCallback(async () => {
    console.log(loadingMore);
    if (loadingMore) return; // Prevent multiple calls while loading
    setLoadingMore(true);

    const fetchedPosts = await fetchGlobalFeeds({ accountIds, offset });
    setLoadingMore(false);

    // Filter out previously fetched posts
    const newPosts = fetchedPosts.slice(offset - 20);

    // Update state with new posts and increment offset
    setFeedPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setOffset((prevOffset) => prevOffset + 20);
    setLoadingMore(false);
  }, [accountIds, loadingMore, offset]);

  const noResults = useMemo(
    () => (
      <div
        className={cn(
          "md:flex-col md:px-[105px] md:py-[68px] rounded-3",
          "flex flex-col-reverse items-center justify-between bg-[#f6f5f3] px-6 py-4",
        )}
      >
        <p
          className={cn(
            "font-italic font-500 md:text-[22px] text-4 mb-4 max-w-[290px]",
            "text-center font-lora text-[#292929]",
          )}
        >
          {"No social posts available."}
        </p>

        <img
          className="w-[50%]"
          src="https://ipfs.near.social/ipfs/bafkreibcjfkv5v2e2n3iuaaaxearps2xgjpc6jmuam5tpouvi76tvfr2de"
          alt="pots"
        />
      </div>
    ),
    [],
  );

  return (
    <div className="h-full max-h-full w-full max-w-[1300px] overflow-auto p-8">
      {feedPosts.length === 0 && !isLoading ? (
        noResults
      ) : (
        <InfiniteScrollWrapper
          className="space-y-4"
          dataLength={1000}
          scrollThreshold={1}
          hasMore={true}
          next={loadMorePosts}
          loader={
            <div ref={loadingRef} className="mt-4 min-h-12 text-center">
              <div className="prose">{"Loading..."}</div>
            </div>
          }
        >
          {feedPosts.map((post) => (
            <FeedCard key={post.blockHeight} post={post} />
          ))}
        </InfiniteScrollWrapper>
      )}
    </div>
  );
}

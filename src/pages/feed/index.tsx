/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useRef, useState } from "react";

import InfiniteScrollWrapper from "react-infinite-scroll-component";

import { fetchGlobalFeeds } from "@/common/api/near-social";
import { ListRegistration, potlock } from "@/common/api/potlock";
import { POTLOCK_REGISTRY_LIST_ID } from "@/common/constants";
import { FeedCard } from "@/modules/profile/components/FeedCard";

const GlobalFeedsPage = () => {
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [registration, setRegistrations] = useState<ListRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const loadingRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(40);

  const { data, isLoading } = potlock.useListRegistrations({
    listId: POTLOCK_REGISTRY_LIST_ID,
  });

  useEffect(() => {
    setLoading(true);

    // Fetch registrations and feeds
    const results = data?.results || [];
    setRegistrations(results);
    const accountIds = results.map((account) => account.registrant.id);

    fetchGlobalFeeds({
      accountId: accountIds,
    })
      .then((posts) => {
        setLoadingMore(isLoading);
        setFeedPosts(posts); // Flatten the array if necessary
        setLoading(isLoading);
      })
      .catch((err) => {
        console.error("Error fetching registrations or feeds:", err);
      })
      .finally(() => {
        setLoading(isLoading); // Ensure loading state is updated
      });
  }, []);

  const loadMorePosts = useCallback(async () => {
    console.log(loadingMore);
    if (loadingMore) return; // Prevent multiple calls while loading
    setLoadingMore(true);

    const fetchedPosts = await fetchGlobalFeeds({
      accountId: registration,
      offset,
    });
    setLoadingMore(false);

    // Filter out previously fetched posts
    const newPosts = fetchedPosts.slice(offset - 20);

    // Update state with new posts and increment offset
    setFeedPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setOffset((prevOffset) => prevOffset + 20);
    setLoadingMore(false);
  }, []);

  const NoResults = () => (
    <div className="md:flex-col md:px-[105px] md:py-[68px] flex flex-col-reverse items-center justify-between rounded-[12px] bg-[#f6f5f3] px-[24px] py-[16px]">
      <p className="font-italic font-500 md:text-[22px] mb-4 max-w-[290px] text-center font-lora text-[16px] text-[#292929]">
        This project has no Feeds yet.
      </p>

      <img
        className="w-[50%]"
        src="https://ipfs.near.social/ipfs/bafkreibcjfkv5v2e2n3iuaaaxearps2xgjpc6jmuam5tpouvi76tvfr2de"
        alt="pots"
      />
    </div>
  );

  return (
    <div className="h-full max-h-full w-full max-w-[1300px] overflow-auto p-8">
      <InfiniteScrollWrapper
        className="space-y-4"
        dataLength={1000}
        scrollThreshold={1}
        hasMore={true}
        next={loadMorePosts}
        loader={
          <div ref={loadingRef} className="mt-4 min-h-12 text-center">
            <div className="">Loading...</div>
          </div>
        }
      >
        {feedPosts.map((post) => (
          <FeedCard key={post.blockHeight} post={post} />
        ))}
      </InfiniteScrollWrapper>
      {feedPosts.length === 0 && loading && <NoResults />}
    </div>
  );
};
export default GlobalFeedsPage;

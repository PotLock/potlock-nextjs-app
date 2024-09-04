/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useRef, useState } from "react";

import { fetchGlobalFeeds } from "@/common/api/near-social";
import { ListRegistration, potlock } from "@/common/api/potlock";
import { POTLOCK_REGISTRY_LIST_ID } from "@/common/constants";
import { getRegistrations } from "@/common/contracts/potlock/lists";
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
    const fetchRegistrationsAndFeeds = () => {
      setLoading(isLoading);

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
    };

    fetchRegistrationsAndFeeds();
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (loadingMore) return; // Prevent multiple calls while loading
    setLoadingMore(true);

    const fetchedPosts = await fetchGlobalFeeds({
      accountId: registration,
      offset,
    });

    // Create a Set of existing post block heights to filter out duplicates
    const existingPostIds = new Set(feedPosts.map((post) => post.blockHeight));

    // Filter out previously fetched posts
    const newPosts = fetchedPosts.filter(
      (post) => !existingPostIds.has(post.blockHeight),
    );

    // Update state with new posts and increment offset
    setFeedPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setOffset((prevOffset) => prevOffset + 20);
    setLoadingMore(false);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMorePosts();
      }
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loadingRef]);

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
      <div className="space-y-4">
        {feedPosts.map((post) => (
          <FeedCard key={post.blockHeight} post={post} />
        ))}
      </div>
      {feedPosts.length > 1 && (
        <div ref={loadingRef} className="mt-4 min-h-12 text-center">
          <div className="">Loading...</div>
        </div>
      )}
      {loading && <NoResults />}
    </div>
  );
};
export default GlobalFeedsPage;

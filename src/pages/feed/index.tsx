"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useRef, useState } from "react";

import { Social } from "@builddao/near-social-js";

import { getRegistrations } from "@/common/contracts/potlock/lists";
import { fetchGlobalFeeds } from "@/common/contracts/social";
import FeedCard from "@/modules/profile/components/FeedCard";

const GlobalFeedsPage = () => {
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [registration, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(40);

  const client = new Social({
    contractId: process.env.NEXT_PUBLIC_SOCIAL_DB_CONTRACT_ID,
    network: process.env.NEXT_PUBLIC_NETWORK,
  });

  useEffect(() => {
    const fetchRegistrationsAndFeeds = async () => {
      setLoading(true);
      try {
        // Fetch registrations
        const registrations = await getRegistrations();
        setRegistrations(registrations);
        const accountIds = registrations.map(
          (account) => account.registrant_id,
        );
        const posts = await fetchGlobalFeeds({
          client,
          accountId: accountIds,
        });
        // Wait for all posts to be fetched
        setLoadingMore(false);
        setFeedPosts(posts); // Flatten the array if necessary
        setLoading(false);
      } catch (err) {
        console.error("Error fetching registrations or feeds:", err);
        setError("Failed to fetch feeds.");
      }
    };

    fetchRegistrationsAndFeeds();
  }, []);

  const loadMorePosts = async () => {
    if (loadingMore) return; // Prevent multiple calls while loading
    setLoadingMore(true);

    const fetchedPosts = await fetchGlobalFeeds({
      client,
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
  };

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
        {feedPosts.map((post, index) => (
          <FeedCard key={index} post={post} />
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

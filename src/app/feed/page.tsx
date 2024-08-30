"use client";

import React, { useEffect, useRef, useState } from "react";

import { Social } from "@builddao/near-social-js";

import { getRegistrations } from "@/common/contracts/potlock/lists";
import { fetchGlobalFeeds } from "@/common/contracts/social";
import FeedCard from "@/modules/profile/components/FeedCard";

const GlobalFeedsPage = () => {
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [registration, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
        setFeedPosts(posts); // Flatten the array if necessary
      } catch (err) {
        console.error("Error fetching registrations or feeds:", err);
        setError("Failed to fetch feeds.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationsAndFeeds();
  }, []);

  const loadMorePosts = async () => {
    if (loading) return; // Prevent multiple calls while loading
    setLoading(true);

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
    setLoading(false);
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
  }, [loadingRef.current]);

  return (
    <div>
      <div className="space-y-4">
        {feedPosts.map((post, index) => (
          <FeedCard key={index} post={post} />
        ))}
      </div>
      {loading && <div className="mt-4 text-center">Loading...</div>}
      {feedPosts.length > 1 && (
        <div ref={loadingRef} className="mt-4 text-center">
          {loading ? "Loading more posts..." : ""}
        </div>
      )}
    </div>
  );
};
export default GlobalFeedsPage;

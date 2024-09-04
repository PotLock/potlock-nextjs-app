/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from "react";

import { fetchAccountFeedPosts } from "@/common/api/near-social";
import {
  IndexPostResultItem,
  ProfileFeedsProps,
} from "@/common/contracts/potlock/interfaces/post.interfaces";

import { FeedCard } from "./FeedCard";

export const ProfileFeeds: React.FC<ProfileFeedsProps> = ({ accountId }) => {
  const [posts, setPosts] = useState<IndexPostResultItem[]>([]);
  const [offset, setOffset] = useState(40);
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchAccountFeedPosts({ accountId }).then((res: any) => {
      setIsLoading(false);
      setPosts(res);
    });
  }, [accountId]);

  const loadMorePosts = async () => {
    if (isLoading) return; // Prevent multiple calls while loading
    setIsLoading(true);

    const fetchedPosts = await fetchAccountFeedPosts({
      accountId,
      offset,
    });

    // Create a Set of existing post block heights to filter out duplicates
    const existingPostIds = new Set(posts.map((post) => post.blockHeight));

    // Filter out previously fetched posts
    const newPosts = fetchedPosts.filter(
      (post) => !existingPostIds.has(post.blockHeight),
    );

    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setOffset((prevOffset) => prevOffset + 20);
    setIsLoading(false);
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
    <div className="my-8 h-full max-h-80 w-full">
      {posts.map((post) => (
        <FeedCard key={post.blockHeight} post={post} />
      ))}
      {posts.length > 1 && (
        <div ref={loadingRef} className="mt-4 min-h-12 text-center">
          {isLoading ? "Loading more posts..." : ""}
        </div>
      )}
      {posts.length === 0 && <NoResults />}
    </div>
  );
};

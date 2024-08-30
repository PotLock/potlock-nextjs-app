import React, { useEffect, useRef, useState } from "react";

import { Social } from "@builddao/near-social-js";

import {
  IndexPostResultItem,
  ProfileFeedsProps,
} from "@/common/contracts/potlock/interfaces/post.interfaces";
import { fetchAccountFeedPosts } from "@/common/contracts/social";

import Post from "./FeedCard";

const ProfileFeeds: React.FC<ProfileFeedsProps> = ({ accountId }) => {
  const [posts, setPosts] = useState<IndexPostResultItem[]>([]);
  const [offset, setOffset] = useState(40);
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const client = new Social({
    contractId: process.env.NEXT_PUBLIC_SOCIAL_DB_CONTRACT_ID,
    network: process.env.NEXT_PUBLIC_NETWORK,
  });

  useEffect(() => {
    setIsLoading(true);
    fetchAccountFeedPosts({ client, accountId }).then((res: any) => {
      setIsLoading(false);
      setPosts(res);
    });
  }, [accountId]);

  const loadMorePosts = async () => {
    if (isLoading) return; // Prevent multiple calls while loading
    setIsLoading(true);

    const fetchedPosts = await fetchAccountFeedPosts({
      client,
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

  return (
    <div className="my-8" style={{ overflowY: "auto", maxHeight: "80vh" }}>
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
      {posts.length > 1 && (
        <div ref={loadingRef} className="mt-4 text-center">
          {isLoading ? "Loading more posts..." : ""}
        </div>
      )}
    </div>
  );
};

export default ProfileFeeds;

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from "react";

import InfiniteScrollWrapper from "react-infinite-scroll-component";

import { walletApi } from "@/common/api/near";
import { fetchAccountFeedPosts } from "@/common/api/near-social";
import { IndexPostResultItem, ProfileFeedsProps } from "@/common/contracts/social/types";

import { CreatePost } from "./CreatePost";
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
    setIsLoading(true);

    const fetchedPosts = await fetchAccountFeedPosts({
      accountId,
      offset,
    });

    const newPosts = fetchedPosts.slice(offset - 20);

    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setOffset((prevOffset) => prevOffset + 20);
    setIsLoading(false);
  };

  const NoResults = () => (
    <div className="flex flex-col-reverse items-center justify-between rounded-[12px] bg-[#f6f5f3] px-[24px] py-[16px] md:flex-col md:px-[105px] md:py-[68px]">
      <p className="font-italic font-500 mb-4 max-w-[290px] text-center font-lora text-[16px] text-[#292929] md:text-[22px]">
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
      {accountId === walletApi?.accountId && <CreatePost accountId={accountId} />}
      <InfiniteScrollWrapper
        className="space-y-4"
        dataLength={100}
        scrollThreshold={1}
        hasMore={true}
        next={loadMorePosts}
        loader={
          isLoading && (
            <div ref={loadingRef} className="mt-4 min-h-12 text-center">
              <div className="">Loading...</div>
            </div>
          )
        }
      >
        {posts?.map((post) => <FeedCard key={post?.blockHeight} post={post} />)}
      </InfiniteScrollWrapper>
      {posts.length === 0 && !isLoading && <NoResults />}
    </div>
  );
};

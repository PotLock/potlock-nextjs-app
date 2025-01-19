import React, { ReactElement, useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";
import InfiniteScrollWrapper from "react-infinite-scroll-component";

import { walletApi } from "@/common/api/near/client";
import { fetchAccountFeedPosts } from "@/common/api/near-social";
import { IndexPostResultItem } from "@/common/contracts/social";
import { cn } from "@/common/ui/utils";
import { PostCard, PostEditor } from "@/entities/post";
import { ProfileLayout } from "@/layout/profile/components/layout";

const NoResults = () => (
  <div
    className={cn(
      "flex flex-col-reverse items-center justify-between rounded-[12px]",
      "bg-[#f6f5f3] px-[24px] py-[16px] md:flex-col md:px-[105px] md:py-[68px]",
    )}
  >
    <p
      className={cn(
        "font-italic font-500 font-lora mb-4 max-w-[290px]",
        "text-nowrap text-center text-[16px] text-[#292929] md:text-[22px]",
      )}
    >
      This project has no posts yet.
    </p>

    <img
      className="w-[50%]"
      src="https://ipfs.near.social/ipfs/bafkreibcjfkv5v2e2n3iuaaaxearps2xgjpc6jmuam5tpouvi76tvfr2de"
      alt="pots"
    />
  </div>
);

export default function ProfileFeedTab() {
  const router = useRouter();
  const { userId: accountId } = router.query as { userId: string };
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

  return (
    <div className="my-8 h-full max-h-80 w-full">
      {accountId === walletApi?.accountId && <PostEditor accountId={accountId} />}

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
        {posts?.map((post) => <PostCard key={post?.blockHeight} post={post} />)}
      </InfiniteScrollWrapper>

      {posts.length === 0 && !isLoading && <NoResults />}
    </div>
  );
}

ProfileFeedTab.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

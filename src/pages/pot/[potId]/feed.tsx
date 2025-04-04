import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/router";
import InfiniteScrollWrapper from "react-infinite-scroll-component";

import { PotApplicationStatus as ApplicationStatus, indexer } from "@/common/api/indexer";
import { fetchGlobalFeeds } from "@/common/api/near-social-indexer";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { PostCard, PostEditor } from "@/entities/post";
import { PotLayout } from "@/layout/pot/components/layout";

const tabs = [
  { name: "Approved Applicants", value: ApplicationStatus.Approved },
  { name: "Pending Applicants", value: ApplicationStatus.Pending },
  { name: "Rejected Applicants", value: ApplicationStatus.Rejected },
];

export default function PotFeedTab() {
  const viewer = useWalletUserSession();
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPotApplicantsReady, setIsPotApplicantsReady] = useState<boolean>(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(50);
  const [tab, setTab] = useState<ApplicationStatus>(ApplicationStatus.Approved);
  const router = useRouter();

  const { potId } = router.query as {
    potId: string;
  };

  const { data } = indexer.usePotApplications({ potId, status: tab });

  const potApplicants = useMemo(() => {
    return {
      ids: data?.results?.map((application) => application?.applicant?.id),
      applicants: data?.results,
    };
  }, [data?.results]);

  const noResults = useMemo(
    () => (
      <div
        className={cn(
          "rounded-3 md:flex-col md:px-[105px] md:py-[68px]",
          "flex flex-col-reverse items-center justify-between bg-[#f6f5f3] px-6 py-4",
        )}
      >
        <p
          className={cn(
            "font-italic font-500 text-4 mb-4 max-w-[290px] md:text-[22px]",
            "font-lora text-center text-[#292929]",
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

  const loadMorePosts = useCallback(async () => {
    try {
      const fetchedPosts = await fetchGlobalFeeds({
        accountIds: potApplicants?.ids,
        offset,
      });

      const existingBlockHeights = new Set(feedPosts.map((post) => post?.blockHeight));
      const uniquePosts = new Set();

      fetchedPosts.forEach((post) => {
        if (post !== undefined && !existingBlockHeights.has(post?.blockHeight)) {
          uniquePosts.add(post);
        }
      });

      const filteredPosts = Array.from(uniquePosts);

      setFeedPosts((prevPosts) => [...prevPosts, ...filteredPosts]);
      setOffset((prevOffset) => prevOffset + 50);
    } catch (error) {
      console.error("Unable to fetch feeds:", error);
    }
  }, [offset, potApplicants?.ids, feedPosts]);

  useEffect(() => {
    setIsLoading(true);
    if (isPotApplicantsReady && !potApplicants?.ids) return;

    try {
      fetchGlobalFeeds({
        accountIds: potApplicants?.ids,
        offset: 50,
      })
        .then((posts) => {
          const filteredPosts = posts.filter((post) => post !== undefined);
          setFeedPosts(filteredPosts);
          setIsLoading(false);
          setOffset(100);
          setIsPotApplicantsReady(true);
        })
        .catch((err) => {
          console.error("Unable to fetch feeds:", err);
        });
    } catch (error) {
      console.error(error);
    }
  }, [potId, potApplicants, isPotApplicantsReady, tab]);

  const handleSwitchTab = (tab: ApplicationStatus) => {
    setTab(tab);
    setFeedPosts([]);
    setIsPotApplicantsReady(false);
    setOffset(50);
  };

  return (
    <div className="w-full">
      {viewer.isSignedIn && potApplicants?.ids?.includes(viewer.accountId) && (
        <PostEditor accountId={viewer.accountId} />
      )}
      <div className="my-6 flex items-center gap-3 md:gap-1">
        {tabs.map((selectedTab) => (
          <button
            key={selectedTab.value}
            onClick={() => handleSwitchTab(selectedTab.value)}
            className={cn("border px-3 py-1 text-sm transition-all duration-200 ease-in-out", {
              "rounded-sm border-[#F4B37D] bg-[#FCE9D5] text-[#91321B]": tab === selectedTab.value,
              "bg-background border-[#DBDBDB] text-black": tab !== selectedTab.value,
            })}
          >
            {selectedTab.name}
          </button>
        ))}
      </div>
      <div>
        {feedPosts.length === 0 && !isLoading ? (
          noResults
        ) : (
          <InfiniteScrollWrapper
            className="space-y-4"
            dataLength={999}
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
            {!!feedPosts?.length &&
              feedPosts.map((post) => {
                const applicant = potApplicants?.applicants?.find(
                  (applicant) => applicant.applicant.id === post.accountId,
                );

                const status = applicant ? applicant.status : undefined;

                return <PostCard isPot status={status} key={post?.blockHeight} post={post} />;
              })}
          </InfiniteScrollWrapper>
        )}
      </div>
    </div>
  );
}

PotFeedTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

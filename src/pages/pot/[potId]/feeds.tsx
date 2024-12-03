import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/router";
import InfiniteScrollWrapper from "react-infinite-scroll-component";

import { PotApplicationStatus as ApplicationStatus } from "@/common/api/indexer";
import { walletApi } from "@/common/api/near";
import { fetchGlobalFeeds } from "@/common/api/near-social";
import { Application, potClient } from "@/common/contracts/core";
import { AccountId } from "@/common/types";
import { cn } from "@/common/ui/utils";
import { FeedCard } from "@/entities/profile";
import { CreatePost } from "@/entities/profile/components/CreatePost";
import { PotLayout } from "@/layout/PotLayout";

const tabs = [
  { name: "Approved Applicants", value: ApplicationStatus.Approved },
  { name: "Pending Applicants", value: ApplicationStatus.Pending },
  { name: "Rejected Applicants", value: ApplicationStatus.Rejected },
];

const FeedsTab = () => {
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(100);
  const [potApplications, setPotApplications] = useState<AccountId[]>([]);
  const [tab, setTab] = useState<ApplicationStatus>(ApplicationStatus.Approved);
  const router = useRouter();
  const { potId } = router.query as {
    potId: string;
  };

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

  const loadMorePosts = useCallback(async () => {
    const fetchedPosts = await fetchGlobalFeeds({
      accountIds: potApplications,
      offset,
    });

    const newPosts = fetchedPosts.slice(offset - 100);

    setFeedPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setOffset((prevOffset) => prevOffset + 100);
  }, [offset, potApplications]);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const applicationsData: Application[] = await potClient.getApplications({ potId });
        fetchGlobalFeeds({
          accountIds: applicationsData
            ?.filter((data) => data.status === tab)
            ?.map((application) => application?.project_id),
        })
          .then((posts) => {
            setFeedPosts(posts);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Unable to fetch feeds:", err);
          });
        setPotApplications(applicationsData?.map((application) => application?.project_id));
      } catch (error) {
        console.error(error);
      }
    })();
  }, [potId, tab]);

  const handleSwitchTab = (tab: ApplicationStatus) => {
    setTab(tab);
  };

  return (
    <div className="w-full">
      {walletApi?.accountId && potApplications?.includes(walletApi?.accountId) && (
        <CreatePost accountId={walletApi?.accountId} />
      )}
      <div className="md:gap-1 my-6 flex items-center gap-3">
        {tabs.map((selectedTab) => (
          <button
            key={selectedTab.value}
            onClick={() => handleSwitchTab(selectedTab.value)}
            className={cn("border px-3 py-1 text-sm transition-all duration-200 ease-in-out", {
              "rounded-sm border-[#F4B37D] bg-[#FCE9D5] text-[#91321B]": tab === selectedTab.value,
              "border-[#DBDBDB] bg-white text-black": tab !== selectedTab.value,
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
            {feedPosts.map((post) => (
              <FeedCard key={post.blockHeight} post={post} />
            ))}
          </InfiniteScrollWrapper>
        )}
      </div>
    </div>
  );
};

FeedsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default FeedsTab;

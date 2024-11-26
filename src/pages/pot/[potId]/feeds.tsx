import {
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useRouter } from "next/router";
import InfiniteScrollWrapper from "react-infinite-scroll-component";

import { walletApi } from "@/common/api/near";
import { fetchGlobalFeeds } from "@/common/api/near-social";
import { Application } from "@/common/contracts/core";
import * as potContract from "@/common/contracts/core/pot";
import { AccountId } from "@/common/types";
import { cn } from "@/common/ui/utils";
import { PotLayout } from "@/modules/pot";
import { FeedCard } from "@/modules/profile";
import { CreatePost } from "@/modules/profile/components/CreatePost";

const FeedsTab = () => {
    const [feedPosts, setFeedPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const loadingRef = useRef<HTMLDivElement | null>(null);
    const [offset, setOffset] = useState(40);
    const [potApplications, setPotApplications] = useState<AccountId[]>([]);
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

        // Filter out previously fetched posts
        const newPosts = fetchedPosts.slice(offset - 20);

        // Update state with new posts and increment offset
        setFeedPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setOffset((prevOffset) => prevOffset + 20);
    }, [offset, potApplications]);

    useEffect(() => {
        // Fetch applications
        (async () => {
            try {
                const applicationsData: Application[] =
                    await potContract.getApplications({ potId });
                fetchGlobalFeeds({
                    accountIds: applicationsData?.map(
                        (application) => application?.project_id,
                    ),
                })
                    .then((posts) => {
                        setFeedPosts(posts);
                        setIsLoading(false);
                    })
                    .catch((err) => {
                        console.error("Unable to fetch feeds:", err);
                    });
                setPotApplications(
                    applicationsData?.map((application) => application?.project_id),
                );
            } catch (error) {
                console.error(error);
            }
        })();
    }, [potId]);

    return (
        <div className="w-full">
            {walletApi?.accountId &&
                potApplications?.includes(walletApi?.accountId) && (
                    <CreatePost accountId={walletApi?.accountId} />
                )}
            <div>
                {feedPosts.length === 0 && !isLoading ? (
                    noResults
                ) : (
                    <InfiniteScrollWrapper
                        className="space-y-4"
                        dataLength={2000}
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

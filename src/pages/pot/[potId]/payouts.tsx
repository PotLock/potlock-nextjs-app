import { useMemo, useState } from "react";

import { useRouter } from "next/router";
import { MdOutlineInfo } from "react-icons/md";

import { indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ID } from "@/common/constants";
import { indivisibleUnitsToBigNum } from "@/common/lib";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  LabeledIcon,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  SearchBar,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/common/ui/layout/components";
import ArrowDown from "@/common/ui/layout/svg/ArrowDown";
import { cn } from "@/common/ui/layout/utils";
import { AccountHandle, AccountProfilePicture } from "@/entities/_shared/account";
import { TokenIcon, useFungibleToken } from "@/entities/_shared/token";
import {
  PotLifecycleStageTagEnum,
  PotPayoutChallenges,
  usePotFeatureFlags,
  usePotLifecycle,
  usePotPayoutLookup,
} from "@/entities/pot";
import {
  PFPayoutJustificationPublicationAction,
  PfPayoutReleaseAction,
} from "@/features/proportional-funding";
import { PotLayout } from "@/layout/pot/components/layout";
import { PotPayoutManager } from "@/layout/pot/components/payout-manager";

const PayoutEntriesSkeleton: React.FC = () =>
  Array.from({ length: 10 }).map((_, index) => (
    <div key={index} className="mt-3 w-full">
      <Skeleton className="h-10 w-full" />
    </div>
  ));

export default function PotPayoutsTab() {
  const router = useRouter();
  const { potId } = router.query as { potId: string };
  const potFeatures = usePotFeatureFlags({ potId });
  const potLifecycle = usePotLifecycle({ potId });
  const { data: potSnapshot, mutate: refetchPotSnapshot } = indexer.usePot({ potId });
  const { data: token } = useFungibleToken({ tokenId: NATIVE_TOKEN_ID });

  const isFunctionalityAvailable = useMemo(
    () =>
      potLifecycle.currentStage?.tag !== PotLifecycleStageTagEnum.Application &&
      potLifecycle.currentStage?.tag !== PotLifecycleStageTagEnum.Matching,

    [potLifecycle.currentStage?.tag],
  );

  const {
    isPayoutListLoading,
    setPayoutSearchTerm,
    setPayoutPageNumber,
    payouts,
    refetchPayouts,
    payoutPageNumber,
    totalPayoutCount,
  } = usePotPayoutLookup({ potId });

  const isFunctionalityBlocked = useMemo(
    () => !isPayoutListLoading && !isFunctionalityAvailable,
    [isFunctionalityAvailable, isPayoutListLoading],
  );

  const [totalChallenges, setTotalChallenges] = useState<number>(0);
  const [showChallenges, setShowChallenges] = useState<boolean>(false);

  const pageNumberButtons = useMemo(() => {
    const totalPages = Math.ceil(totalPayoutCount / 10);
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      // Always show first page
      pages.push(1);

      if (payoutPageNumber <= 4) {
        // Near start
        pages.push(2, 3, 4, 5, "ellipsis", totalPages);
      } else if (payoutPageNumber >= totalPages - 3) {
        // Near end
        pages.push(
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        // Middle
        pages.push(
          "ellipsis",
          payoutPageNumber - 1,
          payoutPageNumber,
          payoutPageNumber + 1,
          "ellipsis",
          totalPages,
        );
      }
    }

    return pages.map((page, i) => (
      <PaginationItem key={i}>
        {page === "ellipsis" ? (
          <PaginationEllipsis />
        ) : (
          <PaginationLink
            onClick={() => setPayoutPageNumber(page)}
            className={cn({
              "border-black font-bold": payoutPageNumber === page,
            })}
          >
            {page}
          </PaginationLink>
        )}
      </PaginationItem>
    ));
  }, [payoutPageNumber, setPayoutPageNumber, totalPayoutCount]);

  const numberOfPages = useMemo(() => Math.ceil(totalPayoutCount / 10), [totalPayoutCount]);

  return isFunctionalityBlocked ? (
    <div className="h-100 flex w-full flex-col">
      <Alert variant="neutral">
        <MdOutlineInfo className="color-neutral-400 h-6 w-6" />
        <AlertTitle>{"Not Available"}</AlertTitle>

        <AlertDescription>
          {"Payouts can only be processed after the matching period completion."}
        </AlertDescription>
      </Alert>
    </div>
  ) : (
    <div
      className={cn(
        "m-0 flex w-full flex-col-reverse items-start justify-between gap-3",
        "p-0 transition-all duration-500 ease-in-out md:flex-row",
      )}
    >
      <div
        className={cn(
          "flex w-full flex-col items-center justify-between",
          "p-0 transition-all duration-500 ease-in-out",
          { "md:w-[65%]": showChallenges },
        )}
      >
        <div className="mb-8 flex w-full flex-row justify-between">
          <div className="flex w-full flex-wrap items-center justify-between">
            <h2 className="text-xl font-semibold">
              {payouts?.length ? "Payouts" : "Estimated Payouts"}
            </h2>
          </div>

          {totalChallenges > 0 && (
            <div
              onClick={() => setShowChallenges(!showChallenges)}
              className={cn(
                "flex cursor-pointer flex-row items-center",
                "transition-all duration-500 ease-in-out hover:opacity-60",
              )}
            >
              <p className="text-sm font-medium">{showChallenges ? "Hide" : "Show"} Challenges</p>

              <p
                className={cn(
                  "ml-1 flex h-5 w-5 items-center justify-center rounded-full",
                  "bg-red-500 p-1 text-[12px] font-semibold text-white",
                )}
              >
                {totalChallenges}
              </p>

              <ArrowDown
                className={cn("ml-3 block transition-all duration-300 ease-in-out", {
                  "md:rotate-265 rotate-180": showChallenges,
                  "rotate-45 md:rotate-90": !showChallenges,
                })}
              />
            </div>
          )}
        </div>

        <div
          className={cn(
            "block w-full transition-all duration-500 ease-in-out",
            "md:hidden md:w-[33%] md:max-w-[33%]",
            { hidden: !showChallenges },
          )}
        >
          <PotPayoutChallenges potDetail={potSnapshot} setTotalChallenges={setTotalChallenges} />
        </div>

        <div className="mb-16 flex w-full flex-col items-start gap-6">
          {!potSnapshot?.all_paid_out && (
            <>
              {potFeatures.hasPFMechanism && (
                <>
                  <PFPayoutJustificationPublicationAction {...{ potId }} />
                  <PfPayoutReleaseAction onSuccess={refetchPotSnapshot} {...{ potId }} />
                </>
              )}

              <Alert variant="neutral">
                <MdOutlineInfo className="color-neutral-400 h-6 w-6" />
                <AlertTitle>{"Justification For Payout Changes"}</AlertTitle>

                <AlertDescription className="flex flex-col gap-4">
                  <span>
                    {(payouts?.length ?? 0) > 0
                      ? "These payouts have been set on the contract but have not been paid out yet."
                      : "These payouts are estimated amounts only and have not been set on the contract yet."}
                  </span>
                </AlertDescription>
              </Alert>
            </>
          )}

          {(payouts?.length ?? 0) === 0 ? (
            <PotPayoutManager onSubmitSuccess={refetchPayouts} {...{ potId }} />
          ) : (
            <>
              <SearchBar
                placeholder="Search Projects"
                onChange={({ target: { value } }) => setPayoutSearchTerm(value)}
              />

              <div className="flex w-full flex-col flex-nowrap items-center overflow-x-auto">
                <div className="flex w-full justify-between bg-neutral-50 text-xs text-neutral-500">
                  <div className="mr-a inline-flex h-10 items-center justify-start gap-2 px-4 py-2">
                    <span className="font-600 shrink grow basis-0 uppercase leading-none">
                      {"Project"}
                    </span>
                  </div>

                  <span className="flex h-10 items-center px-4 py-2">
                    <span className="w-50 font-600 text-end uppercase leading-none">
                      {"Pool Allocation"}
                    </span>
                  </span>
                </div>

                {isPayoutListLoading ? (
                  <PayoutEntriesSkeleton />
                ) : (
                  <>
                    {!isPayoutListLoading && (payouts?.length ?? 0) === 0 ? (
                      <div
                        className={cn(
                          "relative flex w-full flex-row items-center justify-between gap-8",
                          "p-3 md:flex-wrap md:gap-2",
                        )}
                      >
                        {"No payouts to display"}
                      </div>
                    ) : (
                      payouts?.map(({ id, recipient: { id: project_id }, amount }) => {
                        const amountBig = indivisibleUnitsToBigNum(
                          amount,
                          token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
                        );

                        return (
                          <div
                            key={id}
                            className={cn(
                              "relative flex w-full flex-row items-center justify-between",
                              "gap-8 p-4 md:flex-wrap md:gap-2",
                            )}
                          >
                            <div
                              className={cn(
                                "flex w-[110px] flex-1 flex-row items-center justify-start gap-4",
                                "transition duration-200 hover:no-underline",
                              )}
                            >
                              <AccountProfilePicture
                                accountId={project_id}
                                className="h-[24px] w-[24px]"
                              />

                              <AccountHandle
                                accountId={project_id}
                                className="font-semibold text-gray-800 hover:text-red-600"
                              />
                            </div>

                            <div className="inline-flex h-16 items-center overflow-hidden px-4 py-2 pr-0">
                              <Tooltip>
                                <TooltipTrigger>
                                  <LabeledIcon
                                    positioning="icon-text"
                                    caption={`~ ${amountBig.toFixed(2)}`}
                                    classNames={{ root: "w-50 justify-end", caption: "font-600" }}
                                  >
                                    {token && <TokenIcon size="xs" tokenId={token.tokenId} />}
                                  </LabeledIcon>
                                </TooltipTrigger>

                                <TooltipContent>
                                  <span className="font-600">
                                    {`${amountBig.toNumber()} ${token?.metadata.symbol}`}
                                  </span>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </>
                )}
              </div>

              {numberOfPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPayoutPageNumber((prev) => Math.max(prev - 1, 1))}
                      />
                    </PaginationItem>

                    {pageNumberButtons}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPayoutPageNumber((prev) =>
                            Math.min(prev + 1, Math.ceil(totalPayoutCount / 10)),
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>

      <div
        className={cn(
          showChallenges ? "md:block" : "hidden",
          "hidden w-full transition-all duration-500 ease-in-out md:w-[33%]",
        )}
      >
        <PotPayoutChallenges potDetail={potSnapshot} setTotalChallenges={setTotalChallenges} />
      </div>
    </div>
  );
}

PotPayoutsTab.getLayout = function getLayout(page: React.ReactNode) {
  return <PotLayout>{page}</PotLayout>;
};

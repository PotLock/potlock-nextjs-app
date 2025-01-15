import { useMemo, useState } from "react";

import { formatNearAmount } from "near-api-js/lib/utils/format";
import { useRouter } from "next/router";
import { MdOutlineInfo } from "react-icons/md";

import { indexer } from "@/common/api/indexer";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  SearchBar,
  Skeleton,
} from "@/common/ui/components";
import ArrowDown from "@/common/ui/svg/ArrowDown";
import { cn } from "@/common/ui/utils";
import { AccountHandle, AccountProfilePicture } from "@/entities/_shared/account";
import {
  PotLifecycleStageTagEnum,
  PotPayoutChallenges,
  usePotLifecycle,
  usePotPayoutLookup,
} from "@/entities/pot";
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
  const potLifecycle = usePotLifecycle({ potId });
  const { data: pot } = indexer.usePot({ potId });

  const {
    payouts,
    isPayoutsPending,
    setPayoutSearchTerm,
    payoutPageNumber,
    setPayoutPageNumber,
    totalPayoutCount,
  } = usePotPayoutLookup({ potId });

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

  return potLifecycle.currentStage?.tag === PotLifecycleStageTagEnum.Application ||
    potLifecycle.currentStage?.tag === PotLifecycleStageTagEnum.Matching ? (
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
          <PotPayoutChallenges potDetail={pot} setTotalChallenges={setTotalChallenges} />
        </div>

        <div className="mb-16 flex w-full flex-col items-start gap-6">
          {!pot?.all_paid_out && (
            <Alert variant="neutral">
              <MdOutlineInfo className="color-neutral-400 h-6 w-6" />
              <AlertTitle>{"Justification For Payout Changes"}</AlertTitle>

              <AlertDescription>
                {pot?.cooldown_end
                  ? "These payouts have been set on the contract but have not been paid out yet."
                  : "These payouts are estimated amounts only and have not been set on the contract yet."}
              </AlertDescription>
            </Alert>
          )}

          {(payouts?.length ?? 0) === 0 ? (
            <PotPayoutManager {...{ potId }} />
          ) : (
            <>
              <SearchBar
                placeholder="Search Projects"
                onChange={({ target: { value } }) => setPayoutSearchTerm(value)}
              />

              <div className="flex w-full flex-col flex-nowrap items-center overflow-x-auto ">
                <div
                  className={
                    "flex w-full items-center justify-between gap-8 bg-neutral-500 p-2.5 px-4"
                  }
                >
                  <div className="justify-left flex w-28 flex-1 flex-row items-center">
                    <div className="break-words text-sm font-semibold leading-6 text-[#7B7B7B]">
                      PROJECTS
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-start">
                    <div className="break-words text-sm font-semibold leading-6 text-[#7B7B7B]">
                      POOL ALLOCATION
                    </div>
                  </div>
                </div>

                {isPayoutsPending ? (
                  <PayoutEntriesSkeleton />
                ) : (
                  <>
                    {(payouts?.length ?? 0) === 0 ? (
                      <div
                        className={cn(
                          "relative flex w-full flex-row items-center justify-between gap-8",
                          "p-4 md:flex-wrap md:gap-2",
                        )}
                        style={{ padding: "12px" }}
                      >
                        {"No payouts to display"}
                      </div>
                    ) : (
                      payouts?.map(({ id, project_id, amount }) => {
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
                                className={cn(
                                  "font-semibold text-gray-800 no-underline",
                                  "transition duration-200 hover:text-red-600",
                                )}
                              />
                            </div>

                            <div className="">
                              <div className="break-words text-sm font-semibold text-gray-800">
                                {formatNearAmount(amount, 3)}N
                              </div>
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
        <PotPayoutChallenges potDetail={pot} setTotalChallenges={setTotalChallenges} />
      </div>
    </div>
  );
}

PotPayoutsTab.getLayout = function getLayout(page: React.ReactNode) {
  return <PotLayout>{page}</PotLayout>;
};

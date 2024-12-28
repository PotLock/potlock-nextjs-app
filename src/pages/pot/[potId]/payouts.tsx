import { ReactElement, useMemo, useState } from "react";

import { Info, Search } from "lucide-react";
import { formatNearAmount } from "near-api-js/lib/utils/format";
import { useRouter } from "next/router";

import { indexer } from "@/common/api/indexer";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Skeleton,
} from "@/common/ui/components";
import ArrowDown from "@/common/ui/svg/ArrowDown";
import { cn } from "@/common/ui/utils";
import { AccountProfilePicture } from "@/entities/account";
import { PotPayoutChallenges, usePotPayoutLookup } from "@/entities/pot";
import { PotLayout } from "@/layout/pot/components/PotLayout";
import rootPathnames from "@/pathnames";

const MAX_ACCOUNT_ID_DISPLAY_LENGTH = 10;

export default function PayoutsTab() {
  const router = useRouter();

  const { potId } = router.query as {
    potId: string;
  };

  const { data: potDetail } = indexer.usePot({ potId });

  const {
    payouts,
    isPayoutsPending,
    setPayoutSearchTerm,
    payoutSearchTerm,
    payoutPageNumber,
    setPayoutPageNumber,
    totalPayoutCount,
  } = usePotPayoutLookup({
    potId,
  });

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

  return (
    <div className="m-0 flex w-full  flex-col-reverse items-start justify-between gap-3 p-0 transition-all duration-500 ease-in-out md:flex-row">
      <div
        className={cn(
          "flex w-full flex-col items-center justify-between p-0 transition-all duration-500 ease-in-out",
          {
            "md:w-[65%]": showChallenges,
          },
        )}
      >
        <div className="mb-8 flex w-full flex-row justify-between">
          <h2 className="text-xl font-semibold">Estimated Payout</h2>
          {!!totalChallenges && (
            <div
              onClick={() => setShowChallenges(!showChallenges)}
              className="flex cursor-pointer flex-row items-center transition-all duration-500 ease-in-out hover:opacity-60"
            >
              <p className="text-sm font-medium">{showChallenges ? "Hide" : "Show"} Challenges</p>
              <p className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-1 text-[12px] font-semibold text-white">
                {totalChallenges}
              </p>
              <ArrowDown
                style={{ display: "block" }}
                className={cn(
                  showChallenges ? "md:rotate-265 rotate-180" : "rotate:45 md:rotate-90",
                  "ml-3 transition-all duration-300 ease-in-out",
                )}
              />
            </div>
          )}
        </div>
        <div
          className={cn(
            "block w-full transition-all duration-500 ease-in-out md:hidden md:w-[33%] md:max-w-[33%]",
            {
              hidden: !showChallenges,
            },
          )}
        >
          <PotPayoutChallenges potDetail={potDetail} setTotalChallenges={setTotalChallenges} />
        </div>
        <div className="mb-16 flex w-full flex-col items-start gap-6 md:flex-row">
          <div className=" w-full">
            {!potDetail?.all_paid_out ? (
              <div
                style={{
                  boxShadow:
                    "0px 0px 1px 0px rgba(0, 0, 0, 0.36), 0px 1px 1px -0.5px rgba(55, 55, 55, 0.04), 0px 2px 2px -1px rgba(5, 5, 5, 0.08), 0px 3px 5px -1.5px rgba(55, 55, 55, 0.04)",
                }}
                className="mb-4 flex items-start gap-4 bg-[#f6f6f7] p-4"
              >
                <Info />

                <div className="text-start">
                  <h2 className="text-[17px] font-semibold">Justification For Payout Changes</h2>
                  <p className="text-sm text-[#525252] ">
                    {potDetail?.cooldown_end
                      ? "These payouts have been set on the contract but have not been paid out yet."
                      : "These payouts are estimated amounts only and have not been set on the contract yet."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex w-full items-center gap-4 rounded-lg bg-[#f6f6f7] p-2.5 px-4 md:gap-2">
                  <div className="flex h-6 w-6 items-center justify-center">
                    <Search className="h-5 w-5 text-[#7B7B7B]" />
                  </div>
                  <input
                    onChange={({ target: { value } }) => setPayoutSearchTerm(value)}
                    className="h-full w-full border-none bg-transparent p-2 pl-2 focus:outline-none"
                    type="text"
                    value={payoutSearchTerm}
                    placeholder="Search..."
                  />
                </div>
                <div className="flex w-full flex-col flex-nowrap items-center overflow-x-auto ">
                  <div className="flex w-full flex-row items-center justify-between gap-8  bg-[#f6f6f7] p-2.5 px-4">
                    <div className="justify-left flex w-28 flex-1 flex-row items-center">
                      <div className="break-words  text-sm font-semibold leading-6 text-[#7B7B7B]">
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
                    Array.from({ length: 10 }).map((_, index) => (
                      <div key={index} className="mt-3 w-full">
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))
                  ) : payouts?.length === 0 ? (
                    <div
                      className="relative flex w-full flex-row items-center justify-between gap-8 p-4 md:flex-wrap md:gap-2"
                      style={{ padding: "12px" }}
                    >
                      No payouts to display
                    </div>
                  ) : (
                    payouts?.map((payout, index) => {
                      const { project_id, amount } = payout;

                      return (
                        <div
                          className="relative flex w-full flex-row items-center justify-between gap-8 p-4 md:flex-wrap md:gap-2"
                          key={index}
                        >
                          <div className="flex w-[110px] flex-1 flex-row items-center justify-start gap-4 transition duration-200 hover:no-underline">
                            <AccountProfilePicture
                              accountId={project_id}
                              className="h-[24px] w-[24px]"
                            />
                            <a
                              className="font-semibold text-gray-800 no-underline transition duration-200 hover:text-red-600"
                              href={`${rootPathnames.PROFILE}/${project_id}`}
                              target={"_blank"}
                            >
                              {project_id.length > MAX_ACCOUNT_ID_DISPLAY_LENGTH
                                ? project_id.slice(0, MAX_ACCOUNT_ID_DISPLAY_LENGTH) + "..."
                                : project_id}
                            </a>
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
                </div>
                {numberOfPages > 1 && (
                  <Pagination className="mt-[24px]">
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
      </div>
      <div
        className={cn(
          showChallenges ? "md:block" : "hidden",
          "hidden w-full transition-all duration-500 ease-in-out md:w-[33%]",
        )}
      >
        <PotPayoutChallenges potDetail={potDetail} setTotalChallenges={setTotalChallenges} />
      </div>
    </div>
  );
}

PayoutsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

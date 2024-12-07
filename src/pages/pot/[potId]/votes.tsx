import { useMemo, useState } from "react";

import { useSet } from "@uidotdev/usehooks";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import { MdHowToVote, MdOutlineDescription, MdStar } from "react-icons/md";

import {
  Button,
  Checkbox,
  FilterChip,
  Input,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/common/ui/components";
import { useMediaQuery } from "@/common/ui/hooks";
import { cn } from "@/common/ui/utils";
import { useSessionAuth } from "@/entities/session";
import {
  VotingElectionCandidateFilter,
  VotingElectionCandidatesList,
  VotingRules,
  VotingWeightBoostBreakdown,
  usePotBenefactorCandidates,
  usePotBenefactorsElection,
  useVotingParticipantVoteWeight,
} from "@/features/voting";
import { PotLayout } from "@/layout/PotLayout";

const PAGE_SIZE = 10;

export default function PotVotesTab() {
  const { query: routeQuery } = useRouter();
  const { potId } = routeQuery as { potId: string };
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const userSession = useSessionAuth();
  const { data: election } = usePotBenefactorsElection({ potId });
  const { data: candidates } = usePotBenefactorCandidates({ potId });

  // TODO: Remove after release
  // console.log(election, candidates);

  const authenticatedVoter = useVotingParticipantVoteWeight({
    accountId: userSession.accountId,
    potId,
  });

  const selectedCandidateAccountIds = useSet();

  const handleCandidateSelect = (accountId: string, isSelected: boolean): void =>
    void (isSelected
      ? selectedCandidateAccountIds.add(accountId)
      : selectedCandidateAccountIds.delete(accountId));

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setFilter] = useState<VotingElectionCandidateFilter>("all");
  const [showVotingRules, setShowVotingRules] = useState(false);
  const [showWeightBoost, setShowWeightBoost] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const [votedCount, pendingCount] = useMemo(() => {
    const voted = (candidates ?? []).filter((candidate) => candidate.votes_received > 0).length;
    const pending = (candidates ?? []).filter((candidate) => candidate.votes_received === 0).length;

    return [voted, pending];
  }, [candidates]);

  const pageSearchResults = useMemo(() => {
    const filtered = (candidates ?? []).filter((candidate) => {
      if (activeFilter === "voted") return candidate.votes_received > 0;
      if (activeFilter === "pending") return candidate.votes_received === 0;
      return true;
    });

    const startIndex = (pageNumber - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    return filtered.slice(startIndex, endIndex);
  }, [activeFilter, candidates, pageNumber]);

  const handleVoteAll = () => {
    // TODO: Implement
    console.log("Voting for projects:", Array.from(selectedCandidateAccountIds.values()));
  };

  const numberOfPages = useMemo(() => {
    switch (activeFilter) {
      case "voted":
        return Math.ceil(votedCount / PAGE_SIZE);

      case "pending":
        return Math.ceil(pendingCount / PAGE_SIZE);

      default:
        return Math.ceil(candidates?.length ?? 0 / PAGE_SIZE);
    }
  }, [activeFilter, candidates?.length, pendingCount, votedCount]);

  const pageNumberButtons = useMemo(() => {
    const totalPages = Math.ceil(numberOfPages);
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      pages.push(1);

      if (pageNumber <= 4) {
        pages.push(2, 3, 4, 5, "ellipsis", totalPages);
      } else if (pageNumber >= totalPages - 3) {
        pages.push(
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push("ellipsis", pageNumber - 1, pageNumber, pageNumber + 1, "ellipsis", totalPages);
      }
    }

    return pages.map((page, i) => (
      <PaginationItem key={i}>
        {page === "ellipsis" ? (
          <PaginationEllipsis />
        ) : (
          <PaginationLink
            onClick={() => setPageNumber(page)}
            className={cn({ "border-black font-bold": pageNumber === page })}
          >
            {page}
          </PaginationLink>
        )}
      </PaginationItem>
    ));
  }, [pageNumber, setPageNumber, numberOfPages]);

  return (
    <div className={cn("flex w-full flex-col gap-6")}>
      {/* Search */}
      <div className="relative">
        <Input
          type="search"
          placeholder={"Search Projects"}
          className={cn("w-full bg-gray-50")}
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <FilterChip
          variant={activeFilter === "all" ? "brand-filled" : "brand-outline"}
          onClick={() => setFilter("all")}
          className="font-medium"
          label="All"
          count={candidates?.length ?? 0}
        />

        <FilterChip
          variant={activeFilter === "voted" ? "brand-filled" : "brand-outline"}
          onClick={() => setFilter("voted")}
          className="font-medium"
          label="Voted"
          count={votedCount}
        />

        <FilterChip
          variant={activeFilter === "pending" ? "brand-filled" : "brand-outline"}
          onClick={() => setFilter("pending")}
          className="font-medium"
          label="Pending"
          count={pendingCount}
        />
      </div>

      <div className="flex flex-row gap-6">
        <div className="min-h-137 w-full">
          {/* Header */}
          <div className={cn("absolute inset-x-0 w-full md:static")}>
            <div
              className={cn(
                "flex items-center justify-between bg-[#fce9d5] p-4 text-[17px]",
                "md:rounded-tl-lg md:rounded-tr-lg",
              )}
            >
              <div className="flex items-center gap-2">
                <MdHowToVote className="color-peach-400 h-6 w-6" />

                <span className="font-semibold">{`${votedCount} Project(s)`}</span>
              </div>

              <div className="flex gap-2">
                <div
                  className={cn(
                    "inline-flex h-10 cursor-pointer items-center justify-start gap-2",
                    "rounded-lg border border-[#f8d3b0] bg-[#fef6ee] px-3 py-2.5",
                  )}
                  onClick={() => setShowWeightBoost((prev: Boolean) => !prev)}
                >
                  <MdStar className="color-corn-500 h-4.5 w-4.5" />

                  <span className="flex items-center gap-2 text-sm">
                    <span className="font-500 hidden whitespace-nowrap md:inline-flex">
                      {`${showWeightBoost ? "Hide" : "View"} Weight Boost`}
                    </span>

                    <span className="text-center font-semibold leading-tight text-[#ea6a25]">
                      {`${authenticatedVoter.voteWeight.mul(100).toNumber()} %`}
                    </span>
                  </span>

                  <ChevronRight
                    className={cn("relative hidden h-[18px] w-[18px] text-[#EA6A25] md:block")}
                  />
                </div>

                <div
                  className={cn(
                    "inline-flex h-10 cursor-pointer items-center justify-start gap-2",
                    "rounded-lg border border-[#f8d3b0] bg-[#fef6ee] px-3 py-2.5",
                  )}
                  onClick={() => setShowVotingRules((prev: Boolean) => !prev)}
                >
                  <MdOutlineDescription className="color-peach-500 h-4.5 w-4.5" />

                  <span
                    className={cn(
                      "hidden items-center gap-2 whitespace-nowrap md:inline-flex",
                      "font-500 text-sm",
                    )}
                  >
                    {`${showVotingRules ? "Hide" : "View"} Voting Rules`}
                  </span>

                  <ChevronRight
                    className={cn("hidden h-[18px] w-[18px] text-[#EA6A25] md:block")}
                  />
                </div>
              </div>
            </div>

            <div
              className={cn(
                "flex justify-between bg-[#f7f7f7] px-7 py-2",
                "text-sm font-semibold text-gray-500",
              )}
            >
              <h4 className="font-semibold uppercase">{"Projects"}</h4>

              <div className="flex gap-6">
                <h4 className={cn("hidden text-right font-semibold uppercase md:block")}>
                  {"Votes"}
                </h4>

                <h4 className={cn("hidden text-right font-semibold uppercase md:block")}>
                  {"Actions"}
                </h4>
              </div>
            </div>
          </div>

          <VotingElectionCandidatesList
            data={pageSearchResults}
            onEntrySelect={handleCandidateSelect}
          />

          {numberOfPages > 1 && (
            <Pagination className="mt-[24px]">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  />
                </PaginationItem>

                {pageNumberButtons}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPageNumber((prev) => Math.min(prev + 1, Math.ceil(numberOfPages)))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {/* Floating Action Bar */}
          {selectedCandidateAccountIds.size > 0 && (
            <div
              className={cn(
                "fixed bottom-4 left-1/2 flex -translate-x-1/2",
                "items-center gap-4 rounded-lg border bg-white p-4 shadow-lg",
              )}
            >
              <div className="flex items-center gap-2">
                <Checkbox checked={true} />
                <span>{`${selectedCandidateAccountIds.size} Selected Candidates`}</span>
              </div>

              <Button variant={"standard-filled"} onClick={handleVoteAll}>
                {"Vote All"}
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <VotingRules
            open={showVotingRules}
            onOpenChange={setShowVotingRules}
            mode={isDesktop ? "panel" : "modal"}
            {...{ potId }}
          />

          <VotingWeightBoostBreakdown
            open={showWeightBoost}
            onOpenChange={setShowWeightBoost}
            mode={isDesktop ? "panel" : "modal"}
            {...{ potId }}
          />
        </div>
      </div>
    </div>
  );
}

PotVotesTab.getLayout = function getLayout(page: React.ReactNode) {
  return <PotLayout>{page}</PotLayout>;
};

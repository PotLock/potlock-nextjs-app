import { useMemo, useState } from "react";

import { useSet } from "@uidotdev/usehooks";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import { MdHowToVote, MdOutlineDescription, MdStar } from "react-icons/md";

import { AccountId } from "@/common/types";
import { Button, Checkbox, FilterChip, Input } from "@/common/ui/components";
import { useMediaQuery } from "@/common/ui/hooks";
import { cn } from "@/common/ui/utils";
import { useSessionAuth } from "@/entities/session";
import {
  VotingCandidateFilter,
  VotingCandidateList,
  VotingCandidatesTableHead,
  VotingRules,
  VotingWeightBoostBreakdown,
  useVotingCandidates,
  useVotingElection,
  useVotingParticipantVoteWeight,
} from "@/features/voting";
import { PotLayout } from "@/layout/PotLayout";

export default function PotVotesTab() {
  const userSession = useSessionAuth();
  const { query: routeQuery } = useRouter();
  const { potId } = routeQuery as { potId: string };
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isVotingRuleListDisplayed, setIsVotingRuleListDisplayed] = useState(false);
  const [isWeightBoostBreakdownDisplayed, setIsWeightBoostBreakdownDisplayed] = useState(false);
  const [candidateFilter, setFilter] = useState<VotingCandidateFilter>("all");
  const selectedCandidateAccountIds = useSet();

  const authenticatedVoter = useVotingParticipantVoteWeight({
    accountId: userSession.accountId,
    potId,
  });

  const { data: election } = useVotingElection({ potId });

  const {
    candidates,
    candidatesWithVotes,
    candidatesWithoutVotes,
    candidateSearchQuery,
    setCandidateSearchQuery,
  } = useVotingCandidates({ potId });

  // TODO: temporarily disabled as vote for multiple candidates is unimplemented
  const _handleCandidateSelect = (accountId: AccountId, isSelected: boolean): void =>
    void (isSelected
      ? selectedCandidateAccountIds.add(accountId)
      : selectedCandidateAccountIds.delete(accountId));

  const handleVoteAll = () => {
    // TODO: Implement vote multicall in `features/voting`
    console.log("Voting for projects:", Array.from(selectedCandidateAccountIds.values()));
  };

  const filterPanel = useMemo(
    () => (
      <div className="flex gap-3">
        <FilterChip
          variant={candidateFilter === "all" ? "brand-filled" : "brand-outline"}
          onClick={() => setFilter("all")}
          className="font-medium"
          label="All"
          count={candidates?.length ?? 0}
        />

        <FilterChip
          variant={candidateFilter === "voted" ? "brand-filled" : "brand-outline"}
          onClick={() => setFilter("voted")}
          className="font-medium"
          label="Voted"
          count={candidatesWithVotes.length}
        />

        <FilterChip
          variant={candidateFilter === "pending" ? "brand-filled" : "brand-outline"}
          onClick={() => setFilter("pending")}
          className="font-medium"
          label="Pending"
          count={candidatesWithoutVotes.length}
        />
      </div>
    ),

    [
      candidateFilter,
      candidates?.length,
      candidatesWithVotes.length,
      candidatesWithoutVotes.length,
    ],
  );

  const candidateList = useMemo(() => {
    switch (candidateFilter) {
      case "voted": {
        return (
          <VotingCandidateList
            data={candidatesWithVotes}
            // TODO: temporarily disabled as vote for multiple candidates is unimplemented
            // onEntrySelect={handleCandidateSelect}
            {...{ potId }}
          />
        );
      }

      case "pending": {
        return (
          <VotingCandidateList
            data={candidatesWithoutVotes}
            // TODO: temporarily disabled as vote for multiple candidates is unimplemented
            // onEntrySelect={handleCandidateSelect}
            {...{ potId }}
          />
        );
      }

      default: {
        return (
          <VotingCandidateList
            data={candidates ?? []}
            // TODO: temporarily disabled as vote for multiple candidates is unimplemented
            // onEntrySelect={handleCandidateSelect}
            {...{ potId }}
          />
        );
      }
    }
  }, [candidateFilter, candidates, candidatesWithVotes, candidatesWithoutVotes, potId]);

  return (
    <div className={cn("flex w-full flex-col gap-6")}>
      {/* Search */}
      <div className="relative">
        <Input
          type="search"
          placeholder={"Search Projects"}
          className={cn("w-full bg-gray-50")}
          value={candidateSearchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCandidateSearchQuery(e.target.value)
          }
        />
      </div>

      {filterPanel}

      <div className="flex flex-row gap-6">
        <div className="min-h-137 w-full">
          {/* Toolbar */}
          <div className={cn("absolute inset-x-0 w-full md:static")}>
            <div
              className={cn(
                "flex items-center justify-between bg-[#fce9d5] p-4 text-[17px]",
                "md:rounded-tl-lg md:rounded-tr-lg",
              )}
            >
              <div className="flex items-center gap-2">
                <MdHowToVote className="color-peach-400 h-6 w-6" />
                <span className="font-semibold">{`${election?.total_votes ?? 0} Vote(s) Casted`}</span>
              </div>

              <div className="flex gap-2">
                <div
                  className={cn(
                    "inline-flex h-10 cursor-pointer items-center justify-start gap-2",
                    "rounded-lg border border-[#f8d3b0] bg-[#fef6ee] px-3 py-2.5",
                  )}
                  onClick={() => setIsWeightBoostBreakdownDisplayed((prev: Boolean) => !prev)}
                >
                  <MdStar className="color-corn-500 h-4.5 w-4.5" />

                  <span className="flex items-center gap-2 text-sm">
                    <span className="font-500 hidden whitespace-nowrap md:inline-flex">
                      {`${isWeightBoostBreakdownDisplayed ? "Hide" : "View"} Weight Boost`}
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
                  onClick={() => setIsVotingRuleListDisplayed((prev: Boolean) => !prev)}
                >
                  <MdOutlineDescription className="color-peach-500 h-4.5 w-4.5" />

                  <span
                    className={cn(
                      "hidden items-center gap-2 whitespace-nowrap md:inline-flex",
                      "font-500 text-sm",
                    )}
                  >
                    {`${isVotingRuleListDisplayed ? "Hide" : "View"} Voting Rules`}
                  </span>

                  <ChevronRight
                    className={cn("hidden h-[18px] w-[18px] text-[#EA6A25] md:block")}
                  />
                </div>
              </div>
            </div>

            <VotingCandidatesTableHead />
          </div>

          {candidateList}

          {/* Floating Action Bar */}
          {selectedCandidateAccountIds.size > 0 && (
            <div
              className={cn(
                "fixed bottom-4 left-1/2 flex -translate-x-1/2",
                "items-center gap-4 rounded-lg border bg-white p-4 shadow-lg",
                // TODO: temporarily disabled as vote for multiple candidates is unimplemented
                { hidden: true /* selectedCandidateAccountIds.size > 0 */ },
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
            open={isVotingRuleListDisplayed}
            onOpenChange={setIsVotingRuleListDisplayed}
            mode={isDesktop ? "panel" : "modal"}
            {...{ potId }}
          />

          <VotingWeightBoostBreakdown
            open={isWeightBoostBreakdownDisplayed}
            onOpenChange={setIsWeightBoostBreakdownDisplayed}
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

import { type ChangeEvent, useCallback, useMemo, useState } from "react";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import {
  MdFileDownload,
  MdHowToVote,
  MdOutlineDescription,
  MdOutlineInfo,
  MdStar,
} from "react-icons/md";

import { nearClient } from "@/common/api/near";
import { votingContractHooks } from "@/common/contracts/core/voting";
import { isAccountId } from "@/common/lib";
import type { AccountId } from "@/common/types";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  FilterChip,
  SearchBar,
  Skeleton,
} from "@/common/ui/components";
import { useMediaQuery } from "@/common/ui/hooks";
import { cn } from "@/common/ui/utils";
import { useViewerSession } from "@/common/viewer";
import {
  VotingRoundCandidateFilter,
  VotingRoundCandidateTable,
  VotingRoundRuleList,
  VotingRoundVoteWeightBreakdown,
  useVotingRound,
  useVotingRoundCandidateLookup,
  useVotingRoundResults,
  useVotingRoundVoterVoteWeight,
} from "@/entities/voting-round";
import { PotLayout } from "@/layout/pot/components/layout";

export default function PotVotesTab() {
  const viewer = useViewerSession();
  const { query: routeQuery } = useRouter();
  const { potId } = routeQuery as { potId: string };
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const onSignInClick = useCallback(() => {
    nearClient.walletApi.signInModal();
  }, []);

  const [isVotingRuleListVisible, setIsVotingRuleListVisible] = useState(false);
  const [isWeightBoostBreakdownVisible, setIsWeightBoostBreakdownVisible] = useState(false);
  const isSidebarVisible = isDesktop && (isVotingRuleListVisible || isWeightBoostBreakdownVisible);
  const [candidateFilter, setFilter] = useState<VotingRoundCandidateFilter>("all");

  const authenticatedVoter = useVotingRoundVoterVoteWeight({
    accountId: viewer.accountId,
    potId,
  });

  const votingRound = useVotingRound({ potId });

  const { data: isVotingPeriodOngoing } = votingContractHooks.useIsVotingPeriod({
    enabled: votingRound !== undefined,
    electionId: votingRound?.electionId ?? 0,
  });

  const votingRoundResults = useVotingRoundResults({ enabled: !isVotingPeriodOngoing, potId });

  const { data: authenticatedVotingRoundVoterVotes } = votingContractHooks.useVotingRoundVoterVotes(
    {
      enabled: votingRound !== undefined && isAccountId(viewer.accountId),
      electionId: votingRound?.electionId ?? 0,
      accountId: viewer.accountId as AccountId,
    },
  );

  const { data: activeElectionVoteCount } = votingContractHooks.useElectionVoteCount({
    enabled: votingRound !== undefined,
    electionId: votingRound?.electionId ?? 0,
  });

  const { data: activeElectionVoterAccountIds } = votingContractHooks.useUniqueVoters({
    enabled: votingRound !== undefined,
    electionId: votingRound?.electionId ?? 0,
  });

  const {
    candidates,
    setCandidateSearchTerm,
    votedCandidates,
    votableCandidates,
    mutate: revalidateCandidates,
  } = useVotingRoundCandidateLookup({ electionId: votingRound?.electionId ?? 0 });

  const onSearchTermChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => setCandidateSearchTerm(target.value),
    [setCandidateSearchTerm],
  );

  const filterPanel = useMemo(
    () => (
      <div className="flex flex-wrap gap-3">
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
          label="Voted by You"
          count={votedCandidates.length}
        />

        <FilterChip
          variant={candidateFilter === "pending" ? "brand-filled" : "brand-outline"}
          onClick={() => setFilter("pending")}
          className="font-medium"
          label="Not Voted by You"
          count={votableCandidates.length}
        />
      </div>
    ),

    [candidateFilter, candidates?.length, votableCandidates.length, votedCandidates.length],
  );

  const candidateList = useMemo(() => {
    switch (candidateFilter) {
      case "voted": {
        return votedCandidates;
      }

      case "pending": {
        return votableCandidates;
      }

      default: {
        return candidates ?? [];
      }
    }
  }, [candidateFilter, votedCandidates, votableCandidates, candidates]);

  return votingRound === undefined ? (
    <div className="h-100 flex w-full flex-col items-center justify-center">
      <p className="prose text-2xl">{"Voting round hasn't started yet."}</p>
    </div>
  ) : (
    <div className="flex w-full flex-col gap-6">
      {isVotingPeriodOngoing && (
        <Alert variant="neutral">
          <MdOutlineInfo className="color-neutral-400 h-6 w-6" />
          <AlertTitle>{"Voting round is open"}</AlertTitle>
          <AlertDescription>{"You can cast your votes now."}</AlertDescription>
        </Alert>
      )}

      <SearchBar placeholder="Search Projects" onChange={onSearchTermChange} />

      <div className="flex w-full justify-between">
        {filterPanel}

        <div className="inline-flex h-8 w-60 items-baseline justify-start gap-2 pt-1">
          <div className="flex items-baseline justify-center gap-1">
            <div className=" text-sm font-semibold leading-tight text-neutral-950">
              {`${activeElectionVoteCount ?? 0} Votes`}
            </div>

            <div className="text-right text-xs uppercase leading-none tracking-wide text-neutral-950">
              {"casted by"}
            </div>
          </div>

          <div className="flex items-baseline justify-center gap-1">
            <div className="text-sm font-semibold leading-tight text-neutral-950">
              {activeElectionVoterAccountIds?.length ?? 0}
            </div>

            <div className="text-right text-xs uppercase leading-none tracking-wide text-neutral-950">
              {"voters"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-6">
        <div className="min-h-137 w-full">
          <div
            className={cn(
              "flex w-full items-center justify-between bg-[#fce9d5] p-4 text-[17px]",
              "md:rounded-tl-lg md:rounded-tr-lg",
            )}
          >
            <div className="flex items-center gap-2">
              <MdHowToVote className="color-peach-400 h-6 w-6" />

              {viewer.isSignedIn ? (
                <span className="inline-flex flex-nowrap items-center font-semibold">
                  {isVotingPeriodOngoing ? (
                    <>
                      <span className="font-600 text-xl leading-loose">
                        {authenticatedVotingRoundVoterVotes?.length ?? 0}
                      </span>

                      <span className="font-500 text-4.25 leading-normal">
                        {`/${votingRound.election.votes_per_voter ?? 0} Votes Casted by You`}
                      </span>
                    </>
                  ) : (
                    <span className="font-600 text-lg">{"Round is finished"}</span>
                  )}
                </span>
              ) : (
                <>
                  {isVotingPeriodOngoing ? (
                    <div className="font-500 text-4.25 flex items-center justify-center gap-1">
                      <span className="prose">{"Please"}</span>

                      <Button
                        font="semibold"
                        variant="standard-plain"
                        onClick={onSignInClick}
                        className={cn(
                          "underline-dotted underline-offset-3 underline-neutral-950",
                          "underline-opacity-30 hover:underline-solid important:text-lg",
                          "border-none p-0 underline",
                        )}
                      >
                        {"Sign In"}
                      </Button>

                      <span className="prose">{"to vote."}</span>
                    </div>
                  ) : (
                    <span className="inline-flex flex-nowrap items-center font-semibold">
                      <span className="font-500 text-4.25 leading-normal">{"Final Results"}</span>
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-2">
              {isVotingPeriodOngoing ? null : (
                <>
                  {votingRoundResults.isLoading ? (
                    <Skeleton className="w-45 h-10" />
                  ) : (
                    <Button
                      variant="standard-outline"
                      onClick={votingRoundResults.handleVotersCsvDownload}
                    >
                      <MdFileDownload className="h-4.5 w-4.5" />

                      <span className="font-500 whitespace-nowrap text-sm">
                        {"Download voter data CSV"}
                      </span>
                    </Button>
                  )}
                </>
              )}

              <div
                className={cn(
                  "inline-flex h-10 cursor-pointer items-center justify-start gap-2",
                  "rounded-lg border border-[#f8d3b0] bg-[#fef6ee] px-3 py-2.5",
                )}
                onClick={() => setIsWeightBoostBreakdownVisible((prev: Boolean) => !prev)}
              >
                <MdStar className="color-corn-500 h-4.5 w-4.5" />

                <span className="flex items-center items-baseline gap-2 text-sm">
                  <span className="font-500 hidden whitespace-nowrap lg:inline-flex">
                    {`${isWeightBoostBreakdownVisible ? "Hide" : "View"} Weight Boost`}
                  </span>

                  <span className="text-center font-semibold leading-tight text-[#ea6a25]">
                    {`${authenticatedVoter.voteWeight.mul(100).toNumber()} %`}
                  </span>
                </span>

                <ChevronRight
                  className={cn("relative hidden h-[18px] w-[18px] text-[#EA6A25] lg:block")}
                />
              </div>

              <div
                className={cn(
                  "inline-flex h-10 cursor-pointer items-center justify-start gap-2",
                  "rounded-lg border border-[#f8d3b0] bg-[#fef6ee] px-3 py-2.5",
                )}
                onClick={() => setIsVotingRuleListVisible((prev: Boolean) => !prev)}
              >
                <MdOutlineDescription className="color-peach-500 h-4.5 w-4.5" />

                <span
                  className={cn(
                    "hidden items-center gap-2 whitespace-nowrap lg:inline-flex",
                    "font-500 text-sm",
                  )}
                >
                  {`${isVotingRuleListVisible ? "Hide" : "View"} Voting Rules`}
                </span>

                <ChevronRight className={cn("hidden h-[18px] w-[18px] text-[#EA6A25] lg:block")} />
              </div>
            </div>
          </div>

          <VotingRoundCandidateTable
            electionId={votingRound.electionId}
            data={candidateList}
            onBulkVoteSuccess={revalidateCandidates}
          />
        </div>

        <div className={cn("flex flex-col gap-6", { hidden: !isSidebarVisible })}>
          <VotingRoundRuleList
            open={isVotingRuleListVisible}
            onOpenChange={setIsVotingRuleListVisible}
            mode={isDesktop ? "panel" : "modal"}
            {...{ potId }}
          />

          <VotingRoundVoteWeightBreakdown
            open={isWeightBoostBreakdownVisible}
            onOpenChange={setIsWeightBoostBreakdownVisible}
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

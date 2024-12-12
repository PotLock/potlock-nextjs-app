import { useMemo, useState } from "react";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import { MdHowToVote, MdOutlineDescription, MdStar } from "react-icons/md";

import { votingHooks } from "@/common/contracts/core/voting";
import { FilterChip, Input } from "@/common/ui/components";
import { useMediaQuery } from "@/common/ui/hooks";
import { cn } from "@/common/ui/utils";
import { usePotActiveElections } from "@/entities/pot";
import { useSessionAuth } from "@/entities/session";
import {
  VotingCandidateFilter,
  VotingCandidateList,
  VotingRules,
  VotingWeightBoostBreakdown,
  useVotingCandidateLookup,
  useVotingParticipantVoteWeight,
} from "@/features/voting";
import { PotLayout } from "@/layout/pot/components/PotLayout";

export default function PotVotesTab() {
  const userSession = useSessionAuth();
  const { query: routeQuery } = useRouter();
  const { potId } = routeQuery as { potId: string };
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [isVotingRuleListVisible, setIsVotingRuleListVisible] = useState(false);
  const [isWeightBoostBreakdownVisible, setIsWeightBoostBreakdownVisible] = useState(false);
  const isSidebarVisible = isDesktop && (isVotingRuleListVisible || isWeightBoostBreakdownVisible);
  const [candidateFilter, setFilter] = useState<VotingCandidateFilter>("all");

  const { potActiveElections } = usePotActiveElections({ potId });
  // TODO: Figure out a way to know exactly which ONE election is active ( Pots V2 milestone )
  const [activeElectionId, _activeElection] = potActiveElections?.at(0) ?? [0, undefined];

  const { data: activeElectionVoteCount } = votingHooks.useElectionVoteCount({
    electionId: activeElectionId ?? 0,
  });

  const authenticatedVoter = useVotingParticipantVoteWeight({
    accountId: userSession.accountId,
    potId,
  });

  const { data: authenticatedVoterVotes } = votingHooks.useVoterVotes({
    accountId: userSession.accountId,
    electionId: activeElectionId ?? 0,
  });

  const { data: remainingVotingCapacity } = votingHooks.useVoterRemainingCapacity({
    accountId: userSession.accountId,
    electionId: activeElectionId ?? 0,
  });

  const {
    candidates,
    candidateSearchTerm,
    setCandidateSearchTerm,
    votedCandidates,
    votableCandidates,
    mutate: revalidateCandidates,
  } = useVotingCandidateLookup({ electionId: activeElectionId });

  const toolbar = useMemo(
    () => (
      <div
        className={cn(
          "flex w-full items-center justify-between bg-[#fce9d5] p-4 text-[17px]",
          "md:rounded-tl-lg md:rounded-tr-lg",
        )}
      >
        <div className="flex items-center gap-2">
          <MdHowToVote className="color-peach-400 h-6 w-6" />

          <span className="inline-flex flex-nowrap items-center font-semibold">
            <span className="font-600 text-xl leading-loose">
              {authenticatedVoterVotes?.length ?? 0}
            </span>

            <span className="font-500 text-4.25 leading-normal">
              {/* {`/${remainingVotingCapacity ?? 0} Votes Casted`} */}
              {" Votes Casted"}
            </span>
          </span>
        </div>

        <div className="flex gap-2">
          <div
            className={cn(
              "inline-flex h-10 cursor-pointer items-center justify-start gap-2",
              "rounded-lg border border-[#f8d3b0] bg-[#fef6ee] px-3 py-2.5",
            )}
            onClick={() => setIsWeightBoostBreakdownVisible((prev: Boolean) => !prev)}
          >
            <MdStar className="color-corn-500 h-4.5 w-4.5" />

            <span className="flex items-center gap-2 text-sm">
              <span className="font-500 hidden whitespace-nowrap md:inline-flex">
                {`${isWeightBoostBreakdownVisible ? "Hide" : "View"} Weight Boost`}
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
            onClick={() => setIsVotingRuleListVisible((prev: Boolean) => !prev)}
          >
            <MdOutlineDescription className="color-peach-500 h-4.5 w-4.5" />

            <span
              className={cn(
                "hidden items-center gap-2 whitespace-nowrap md:inline-flex",
                "font-500 text-sm",
              )}
            >
              {`${isVotingRuleListVisible ? "Hide" : "View"} Voting Rules`}
            </span>

            <ChevronRight className={cn("hidden h-[18px] w-[18px] text-[#EA6A25] md:block")} />
          </div>
        </div>
      </div>
    ),

    [
      authenticatedVoter.voteWeight,
      authenticatedVoterVotes?.length,
      isVotingRuleListVisible,
      isWeightBoostBreakdownVisible,
      remainingVotingCapacity,
    ],
  );

  const candidateList = useMemo(() => {
    switch (candidateFilter) {
      case "voted": {
        return (
          <VotingCandidateList
            electionId={activeElectionId}
            data={votedCandidates}
            onBulkVoteSuccess={revalidateCandidates}
          />
        );
      }

      case "pending": {
        return (
          <VotingCandidateList
            electionId={activeElectionId}
            data={votableCandidates}
            onBulkVoteSuccess={revalidateCandidates}
          />
        );
      }

      default: {
        return (
          <VotingCandidateList
            electionId={activeElectionId}
            data={candidates ?? []}
            onBulkVoteSuccess={revalidateCandidates}
          />
        );
      }
    }
  }, [
    candidateFilter,
    activeElectionId,
    votedCandidates,
    revalidateCandidates,
    votableCandidates,
    candidates,
  ]);

  return (
    <div className={cn("flex w-full flex-col gap-6")}>
      {/* Search */}
      <div className="relative">
        <Input
          type="search"
          placeholder={"Search Projects"}
          className={cn("w-full bg-gray-50")}
          value={candidateSearchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCandidateSearchTerm(e.target.value)
          }
        />
      </div>

      <div className="flex w-full justify-between">
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
            label="Voted By Me"
            count={votedCandidates.length}
          />

          <FilterChip
            variant={candidateFilter === "pending" ? "brand-filled" : "brand-outline"}
            onClick={() => setFilter("pending")}
            className="font-medium"
            label="Not Voted By Me"
            count={votableCandidates.length}
          />
        </div>

        <span className="hidden font-semibold">
          {`${activeElectionVoteCount ?? 0} Votes casted by ${activeElectionVoteCount} Voters`}
        </span>
      </div>

      <div className="flex flex-row gap-6">
        <div className="min-h-137 w-full">
          {toolbar}
          {candidateList}
        </div>

        <div className={cn("flex flex-col gap-6", { hidden: !isSidebarVisible })}>
          <VotingRules
            open={isVotingRuleListVisible}
            onOpenChange={setIsVotingRuleListVisible}
            mode={isDesktop ? "panel" : "modal"}
            {...{ potId }}
          />

          <VotingWeightBoostBreakdown
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

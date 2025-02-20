import { useCallback, useMemo } from "react";

import { values } from "remeda";

import { indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ID } from "@/common/constants";
import { potContractHooks } from "@/common/contracts/core/pot";
import { type ElectionId, votingContractHooks } from "@/common/contracts/core/voting";
import { indivisibleUnitsToBigNum } from "@/common/lib";
import type { ConditionalActivation } from "@/common/types";
import { useToken } from "@/entities/_shared";
import { usePotFeatureFlags } from "@/entities/pot";

import { useVotingRoundResultsStore } from "../model/results";
import { type VotingRoundKey } from "../types";
import { useVotingRound } from "./rounds";
import { VOTING_ROUND_CONFIG_MPDAO } from "../model/config.hardcoded";

export const useVotingRoundResults = ({
  potId,
  enabled = true,
}: VotingRoundKey & ConditionalActivation) => {
  const { data: potConfig } = potContractHooks.useConfig({ enabled, potId });
  const { hasPFMechanism } = usePotFeatureFlags({ potId });

  const { data: matchingPoolToken } = useToken({
    enabled: potConfig !== undefined,

    tokenId:
      potConfig !== undefined && "matching_pool_token_id" in potConfig
        ? ((potConfig?.matching_pool_token_id as string) ?? NATIVE_TOKEN_ID)
        : NATIVE_TOKEN_ID,
  });

  // TODO: Implement mechanism config storage ( Pots V2 milestone )
  const mechanismConfig = VOTING_ROUND_CONFIG_MPDAO;

  const { data: votingRound } = useVotingRound({
    enabled: enabled && hasPFMechanism,
    potId,
  });

  const { isLoading: isVoteListLoading, data: votes } = votingContractHooks.useElectionVotes({
    enabled: enabled && votingRound !== undefined,
    electionId: votingRound?.electionId as ElectionId,
  });

  const { isLoading: isVoterAccountListLoading, data: voterAccountList } =
    votingContractHooks.useUniqueVoters({
      enabled: enabled && votingRound !== undefined,
      electionId: votingRound?.electionId as ElectionId,
    });

  const { isLoading: isVoterStatsSnapshotListLoading, data: voterStatsSnapshot } =
    indexer.useMpdaoVoters({
      enabled: enabled && votingRound !== undefined,
      page_size: 200,
    });

  const isLoading = useMemo(
    () => isVoteListLoading || isVoterAccountListLoading || isVoterStatsSnapshotListLoading,
    [isVoteListLoading, isVoterAccountListLoading, isVoterStatsSnapshotListLoading],
  );

  // TODO: Apply performance optimizations
  const store = useVotingRoundResultsStore();

  const resultsCache = useMemo(
    () => (votingRound ? store.cache[votingRound.electionId] : undefined),
    [store.cache, votingRound],
  );

  if (
    enabled &&
    hasPFMechanism &&
    potConfig &&
    matchingPoolToken &&
    votingRound &&
    votes &&
    voterAccountList &&
    voterStatsSnapshot
  ) {
    if (!resultsCache || resultsCache.totalVoteCount !== votes.length) {
      store.revalidate({
        electionId: votingRound.electionId,
        mechanismConfig,
        votes,
        voterAccountIds: voterAccountList,
        voterStatsSnapshot: voterStatsSnapshot.results,

        matchingPoolBalance: indivisibleUnitsToBigNum(
          potConfig.matching_pool_balance,
          NATIVE_TOKEN_DECIMALS,
        ),

        matchingPoolTokenMetadata: matchingPoolToken.metadata,
      });
    }
  }

  const handleWinnersCsvDownload = useCallback(() => {
    if (resultsCache?.winners) {
      const headers = [
        "Project Account ID",
        "Vote Count",
        "Total Weight",
        "Estimated NEAR Payout Amount",
      ];

      const rows = values(resultsCache.winners)
        .sort((profileA, profileB) => profileB.accumulatedWeight - profileA.accumulatedWeight)
        .map((winner) => [
          winner.accountId,
          winner.votes.length,
          winner.accumulatedWeight,
          winner.estimatedPayoutAmount,
        ]);

      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      // Setting filename received in response
      link.setAttribute("download", `${potId}-results.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [potId, resultsCache]);

  const handleVotersCsvDownload = useCallback(() => {
    if (resultsCache?.voters) {
      const headers = [
        "Voter Account ID",
        "Total Weight",
        mechanismConfig.voteWeightAmplificationRules.map(({ name }) => name.replace(",", "_")),
      ];

      const rows = values(resultsCache.voters)
        .sort((voterA, voterB) => voterB.vote.weight - voterA.vote.weight)
        .map((voter) => [
          voter.accountId,
          voter.vote.weight,

          mechanismConfig.voteWeightAmplificationRules.map(({ criteria: ruleCriteria }) =>
            voter.vote.amplifiers.find(({ criteria }) => criteria === ruleCriteria)?.isApplicable
              ? "yes"
              : "no",
          ),
        ]);

      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.setAttribute("download", `${potId}-voters.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [resultsCache?.voters, mechanismConfig.voteWeightAmplificationRules, potId]);

  if (resultsCache) {
    return {
      isLoading,
      data: resultsCache,
      handleWinnersCsvDownload,
      handleVotersCsvDownload,
    };
  } else {
    return {
      isLoading,
      data: undefined,
      handleWinnersCsvDownload: undefined,
      handleVotersCsvDownload: undefined,
    };
  }
};

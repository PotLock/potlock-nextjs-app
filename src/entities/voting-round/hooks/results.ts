import { useCallback, useMemo } from "react";

import { values } from "remeda";

import { indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_DECIMALS } from "@/common/constants";
import { votingContractHooks } from "@/common/contracts/core/voting";
import { stringifiedU128ToBigNum } from "@/common/lib";
import type { ConditionalActivation } from "@/common/types";
import { usePotFeatureFlags } from "@/entities/pot";

import { useVotingRoundResultsStore } from "../model/results";
import type { VotingRoundKey } from "../types";
import { useVotingRound } from "./rounds";
import { VOTING_ROUND_CONFIG_MPDAO } from "../model/hardcoded";

export const useVotingRoundResults = ({
  potId,
  enabled = true,
}: VotingRoundKey & ConditionalActivation) => {
  const { data: pot } = indexer.usePot({ enabled, potId });
  const { hasProportionalFundingMechanism } = usePotFeatureFlags({ potId });
  // TODO: Implement mechanism config storage ( Pots V2 milestone )
  const mechanismConfig = VOTING_ROUND_CONFIG_MPDAO;

  const votingRound = useVotingRound({
    enabled: enabled && hasProportionalFundingMechanism,
    potId,
  });

  const { isLoading: isVoteListLoading, data: votes } = votingContractHooks.useElectionVotes({
    enabled: enabled && votingRound !== undefined,
    electionId: votingRound?.electionId ?? 0,
  });

  const { isLoading: isVoterListLoading, data: voters } = indexer.useMpdaoVoters({
    enabled: enabled && votingRound !== undefined,
    page_size: 9999,
  });

  const isLoading = useMemo(
    () => isVoteListLoading || isVoterListLoading,
    [isVoteListLoading, isVoterListLoading],
  );

  // TODO: Apply performance optimizations
  const store = useVotingRoundResultsStore();

  const cachedResults = useMemo(
    () => (votingRound ? store.cache[votingRound.electionId] : undefined),
    [store.cache, votingRound],
  );

  if (enabled && hasProportionalFundingMechanism && pot && votingRound && votes && voters) {
    // Recalculate results if votes have changed
    if (!cachedResults || cachedResults.totalVoteCount !== votes.length) {
      store.revalidate({
        electionId: votingRound.electionId,
        mechanismConfig,
        votes,
        voters: voters.results,

        matchingPoolBalance: stringifiedU128ToBigNum(
          pot.matching_pool_balance,
          NATIVE_TOKEN_DECIMALS,
        ),
      });
    }
  }

  const handleWinnersCsvDownload = useCallback(() => {
    if (cachedResults?.winners) {
      const headers = [
        "Project Account ID",
        "Vote Count",
        "Total Weight",
        "Estimated NEAR Payout Amount",
      ];

      const rows = values(cachedResults.winners)
        .sort((profileA, profileB) => profileB.accumulatedWeight - profileA.accumulatedWeight)
        .map((winner) => [
          winner.accountId,
          winner.voteCount,
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
  }, [potId, cachedResults]);

  if (cachedResults) {
    return {
      isLoading,
      data: cachedResults,
      handleWinnersCsvDownload,
    };
  } else {
    return {
      isLoading,
      data: undefined,
      handleWinnersCsvDownload: undefined,
    };
  }
};

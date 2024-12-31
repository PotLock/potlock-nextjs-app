import { useCallback, useMemo } from "react";

import { indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_DECIMALS } from "@/common/constants";
import { votingContractHooks } from "@/common/contracts/core/voting";
import { stringifiedU128ToBigNum } from "@/common/lib";
import { usePotFeatureFlags } from "@/entities/pot";

import { useRoundResultsStore } from "../model/round-results";
import type { VotingRoundKey } from "../types";
import { useVotingRound } from "./rounds";

// TODO: Apply performance optimizations
export const useVotingRoundResults = ({ potId }: VotingRoundKey) => {
  const { data: pot } = indexer.usePot({ potId });
  const { hasProportionalFundingMechanism } = usePotFeatureFlags({ potId });
  const votingRound = useVotingRound({ enabled: hasProportionalFundingMechanism, potId });

  const { data: votes } = votingContractHooks.useElectionVotes({
    enabled: votingRound !== undefined,
    electionId: votingRound?.electionId ?? 0,
  });

  const store = useRoundResultsStore();

  if (pot && votingRound && votes) {
    const cachedResults = store.resultsCache[votingRound.electionId];

    // Update results if votes have changed
    if (!cachedResults || cachedResults.totalVoteCount !== votes.length) {
      store.updateResults({
        electionId: votingRound.electionId,
        votes,

        matchingPoolBalance: stringifiedU128ToBigNum(
          pot.matching_pool_balance,
          NATIVE_TOKEN_DECIMALS,
        ),
      });
    }
  }

  const results = useMemo(
    () => (votingRound ? store.resultsCache[votingRound.electionId] : undefined),
    [store.resultsCache, votingRound],
  );

  const handleCsvDownload = useCallback(() => {
    if (results?.winners) {
      const headers = [
        "Project ID",
        "Vote Count",
        "Accumulated Weight",
        "Estimated NEAR Payout Amount",
      ];

      const rows = Object.values(results.winners).map((winner) => [
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
  }, [potId, results]);

  if (results) {
    return {
      votingRoundResults: results,
      handleVotingRoundResultsCsvDownload: handleCsvDownload,
    };
  } else {
    return {
      votingRoundResults: undefined,
      handleVotingRoundResultsCsvDownload: undefined,
    };
  }
};

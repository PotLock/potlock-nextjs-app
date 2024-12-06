import { useMemo } from "react";

import { Big, BigSource } from "big.js";
import { isTruthy, pick } from "remeda";

import { ByPotId } from "@/common/api/indexer";
import { isBigSource } from "@/common/lib";
import { useSessionAuth } from "@/entities/session";

import { useVotingParticipantStats } from "./participant-stats";
import { VOTING_SUPPORTED_NUMERIC_COMPARATOR_KEYS } from "../constants";
import { VOTING_MECHANISM_CONFIG_MPDAO } from "../model/hardcoded";

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 */
export const useVotingParticipantVoteWeight = ({ potId: _ }: ByPotId) => {
  const { accountId } = useSessionAuth();

  const participantStats = useVotingParticipantStats({
    ...pick(VOTING_MECHANISM_CONFIG_MPDAO, ["stakingTokenContractAccountId"]),
    accountId,
  });

  return useMemo(
    () =>
      VOTING_MECHANISM_CONFIG_MPDAO.rules.reduce((weight, rule) => {
        const participantStatsValue = participantStats[rule.participantStatsPropertyKey];

        switch (rule.comparator) {
          case "isTruthy": {
            return typeof participantStatsValue === "boolean" &&
              isTruthy(participantStatsValue) === rule.expectation
              ? weight.add(rule.amplificationPercent)
              : weight;
          }

          default: {
            if (VOTING_SUPPORTED_NUMERIC_COMPARATOR_KEYS.includes(rule.comparator)) {
              return isBigSource(participantStatsValue) &&
                Big(participantStatsValue as BigSource)[rule.comparator](rule.threshold)
                ? weight.add(rule.amplificationPercent)
                : weight;
            } else return weight;
          }
        }
      }, Big(VOTING_MECHANISM_CONFIG_MPDAO.basicWeight)),

    [participantStats],
  );
};

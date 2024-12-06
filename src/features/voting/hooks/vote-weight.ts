import { useMemo } from "react";

import { Big, BigSource } from "big.js";
import { isTruthy, pick } from "remeda";

import { ByPotId } from "@/common/api/indexer";
import { isBigSource } from "@/common/lib";
import { ByAccountId } from "@/common/types";
import { useSessionAuth } from "@/entities/session";

import { useVotingParticipantStats } from "./participant-stats";
import { VOTING_SUPPORTED_NUMERIC_COMPARATOR_KEYS } from "../constants";
import { VOTING_MECHANISM_CONFIG_MPDAO } from "../model/hardcoded";

export type VotingParticipantVoteWeightInputs = Partial<ByAccountId> & ByPotId;

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 *
 * Calculates the vote weight of a given participant for a given voting round.
 */
export const useVotingParticipantVoteWeight = ({
  accountId,
  potId: _,
}: VotingParticipantVoteWeightInputs) => {
  const { initialWeight, stakingContractAccountId, voteWeightAmplificationRules } =
    // TODO: must be stored in a registry indexed by potId in the future ( Pots V2 milestone )
    VOTING_MECHANISM_CONFIG_MPDAO;

  const participantStats = useVotingParticipantStats({
    accountId,
    stakingContractAccountId,
  });

  const voteWeight = useMemo(() => {
    const initialWeightBig = Big(initialWeight);

    return accountId === undefined
      ? Big(0)
      : voteWeightAmplificationRules.reduce((weight, rule) => {
          const participantStatsValue = participantStats[rule.participantStatsPropertyKey];

          switch (rule.comparator) {
            case "isTruthy": {
              if (
                typeof participantStatsValue === "boolean" &&
                isTruthy(participantStatsValue) === rule.expectation
              ) {
                return weight.add(
                  Big(rule.amplificationPercent)
                    .div(100)
                    .mul(initialWeightBig.gt(0) ? initialWeightBig : 1),
                );
              } else return weight;
            }

            default: {
              if (VOTING_SUPPORTED_NUMERIC_COMPARATOR_KEYS.includes(rule.comparator)) {
                return isBigSource(participantStatsValue) &&
                  Big(participantStatsValue as BigSource)[rule.comparator](rule.threshold)
                  ? weight.add(
                      Big(rule.amplificationPercent)
                        .div(100)
                        .mul(initialWeightBig.gt(0) ? initialWeightBig : 1),
                    )
                  : weight;
              } else return weight;
            }
          }
        }, initialWeightBig);
  }, [accountId, initialWeight, participantStats, voteWeightAmplificationRules]);

  return {
    voteWeight,
    voteWeightAmplificationRules,
  };
};

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 *
 * Calculates the vote weight of the currently authenticated participant for a given voting round.
 */
export const useVotingAuthenticatedParticipantVoteWeight = (
  inputs: Pick<VotingParticipantVoteWeightInputs, "potId">,
) => {
  const { accountId } = useSessionAuth();

  return useVotingParticipantVoteWeight({ ...inputs, accountId });
};

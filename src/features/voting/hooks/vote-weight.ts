import { useMemo } from "react";

import { Big, BigSource } from "big.js";
import { isTruthy } from "remeda";

import { isBigSource } from "@/common/lib";

import { useVotingParticipantStats } from "./participant-stats";
import { VOTING_SUPPORTED_NUMERIC_COMPARATOR_KEYS } from "../constants";
import { VOTING_MECHANISM_CONFIG_MPDAO } from "../model/hardcoded";
import { VotingParticipantKey, VotingVoteWeightAmplifier } from "../types";

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 *
 * Calculates vote weight amplifiers for a given participant in a given voting round.
 */
export const useVotingParticipantVoteWeightAmplifiers = ({
  accountId,
  potId: _,
}: VotingParticipantKey): { voteWeightAmplifiers: VotingVoteWeightAmplifier[] } => {
  const { stakingContractAccountId, voteWeightAmplificationRules } =
    // TODO: must be stored in a registry indexed by potId in the future ( Pots V2 milestone )
    VOTING_MECHANISM_CONFIG_MPDAO;

  const participantStats = useVotingParticipantStats({
    accountId,
    stakingContractAccountId,
  });

  return useMemo(
    () => ({
      voteWeightAmplifiers: voteWeightAmplificationRules.map(
        ({ name, description, participantStatsPropertyKey, amplificationPercent, ...rule }) => {
          const staticAmplifierProps = { name, description, amplificationPercent };
          const participantStatsValue = participantStats[participantStatsPropertyKey];

          switch (rule.comparator) {
            case "isTruthy": {
              return {
                ...staticAmplifierProps,

                isApplicable:
                  typeof participantStatsValue === "boolean" &&
                  isTruthy(participantStatsValue) === rule.expectation,
              };
            }

            default: {
              if (VOTING_SUPPORTED_NUMERIC_COMPARATOR_KEYS.includes(rule.comparator)) {
                return {
                  ...staticAmplifierProps,

                  isApplicable:
                    isBigSource(participantStatsValue) &&
                    Big(participantStatsValue as BigSource)[rule.comparator](rule.threshold),
                };
              } else return { ...staticAmplifierProps, isApplicable: false };
            }
          }
        },
      ),
    }),

    [participantStats, voteWeightAmplificationRules],
  );
};

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 *
 * Calculates the vote weight of a given participant in a given voting round.
 */
export const useVotingParticipantVoteWeight = ({ accountId, potId }: VotingParticipantKey) => {
  const { initialWeight, basicWeight } =
    // TODO: must be stored in a registry indexed by potId in the future ( Pots V2 milestone )
    VOTING_MECHANISM_CONFIG_MPDAO;

  const { voteWeightAmplifiers } = useVotingParticipantVoteWeightAmplifiers({ accountId, potId });

  return useMemo(() => {
    if (accountId === undefined) {
      return { voteWeight: Big(0) };
    } else {
      return {
        voteWeight: voteWeightAmplifiers.reduce(
          (accumulatedWeight, rule) =>
            rule.isApplicable
              ? accumulatedWeight.add(
                  Big(rule.amplificationPercent)
                    .div(100)
                    .mul(basicWeight ?? (accumulatedWeight.gt(0) ? accumulatedWeight : 1)),
                )
              : accumulatedWeight,

          Big(initialWeight),
        ),
      };
    }
  }, [accountId, voteWeightAmplifiers, initialWeight, basicWeight]);
};

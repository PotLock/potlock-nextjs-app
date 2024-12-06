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
  // TODO: must be stored in a registry indexed by potId in the future ( Pots V2 milestone )
  const votingMechanismConfig = VOTING_MECHANISM_CONFIG_MPDAO;

  const participantStats = useVotingParticipantStats({
    ...pick(votingMechanismConfig, ["stakingTokenContractAccountId"]),
    accountId,
  });

  const voteWeight = useMemo(
    () =>
      accountId === undefined
        ? Big(0)
        : votingMechanismConfig.voteWeightAmplificationRules.reduce((weight, rule) => {
            const participantStatsValue = participantStats[rule.participantStatsPropertyKey];

            switch (rule.comparator) {
              case "isTruthy": {
                return typeof participantStatsValue === "boolean" &&
                  isTruthy(participantStatsValue) === rule.expectation
                  ? weight.add(
                      Big(rule.amplificationPercent)
                        .div(100)
                        .mul(votingMechanismConfig.basicWeight),
                    )
                  : weight;
              }

              default: {
                if (VOTING_SUPPORTED_NUMERIC_COMPARATOR_KEYS.includes(rule.comparator)) {
                  return isBigSource(participantStatsValue) &&
                    Big(participantStatsValue as BigSource)[rule.comparator](rule.threshold)
                    ? weight.add(
                        Big(rule.amplificationPercent)
                          .div(100)
                          .mul(votingMechanismConfig.basicWeight),
                      )
                    : weight;
                } else return weight;
              }
            }
          }, Big(votingMechanismConfig.basicWeight)),

    [
      accountId,
      participantStats,
      votingMechanismConfig.basicWeight,
      votingMechanismConfig.voteWeightAmplificationRules,
    ],
  );

  return {
    ...pick(votingMechanismConfig, ["voteWeightAmplificationRules"]),
    voteWeight,
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

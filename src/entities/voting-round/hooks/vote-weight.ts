import { useMemo } from "react";

import { Big } from "big.js";

import type { AccountId } from "@/common/types";

import { useVoterProfile } from "./voter-profile";
import { VOTING_ROUND_CONFIG_MPDAO } from "../model/config.hardcoded";
import { VotingRoundVoteWeightAmplifier, VotingRoundVoterKey } from "../types";
import { getVoteWeightAmplifiers } from "../utils/weight";

// TODO: Consider merging the two hooks into one

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 *
 * Calculates vote weight amplifiers for a given participant in a given voting round.
 */
export const useVotingRoundVoterVoteWeightAmplifiers = ({
  accountId,
  potId: _,
}: VotingRoundVoterKey): VotingRoundVoteWeightAmplifier[] => {
  const votingRoundConfig = VOTING_ROUND_CONFIG_MPDAO;

  const voterProfile = useVoterProfile({
    enabled: accountId !== undefined,
    accountId: accountId as AccountId,
  });

  return useMemo(
    () => getVoteWeightAmplifiers(voterProfile, votingRoundConfig),
    [voterProfile, votingRoundConfig],
  );
};

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 *
 * Calculates the vote weight of a given participant in a given voting round.
 */
export const useVotingRoundVoterVoteWeight = ({ accountId, potId }: VotingRoundVoterKey) => {
  const votingRoundConfig = VOTING_ROUND_CONFIG_MPDAO;
  const voteWeightAmplifiers = useVotingRoundVoterVoteWeightAmplifiers({ accountId, potId });

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
                    .mul(votingRoundConfig.basicWeight || 1),
                )
              : accumulatedWeight,

          Big(votingRoundConfig.initialWeight),
        ),
      };
    }
  }, [
    accountId,
    voteWeightAmplifiers,
    votingRoundConfig.initialWeight,
    votingRoundConfig.basicWeight,
  ]);
};

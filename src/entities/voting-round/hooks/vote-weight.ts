import { useMemo } from "react";

import { Big } from "big.js";
import { pick } from "remeda";

import { NUMERIC_COMPARATOR_KEYS } from "@/common/lib";

import { useVoterProfile } from "./voter-profile";
import { VOTING_ROUND_CONFIG_MPDAO } from "../model/hardcoded";
import { VotingRoundVoteWeightAmplifier, VotingRoundVoterKey } from "../types";

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
  const { stakingContractAccountId, voteWeightAmplificationRules } =
    // TODO: must be stored in a registry indexed by potId in the future ( Pots V2 milestone )
    VOTING_ROUND_CONFIG_MPDAO;

  const voterProfile = useVoterProfile({ accountId, stakingContractAccountId });

  return useMemo(
    () =>
      voteWeightAmplificationRules.map((rule) => {
        const profileParameter = voterProfile[rule.voterProfileParameter];

        const staticAmplifierProps = pick(rule, [
          "name",
          "description",
          "criteria",
          "amplificationPercent",
        ]);

        switch (rule.comparator) {
          case "boolean": {
            return {
              ...staticAmplifierProps,

              isApplicable:
                typeof profileParameter === "boolean" && profileParameter === rule.expectation,
            };
          }

          default: {
            if (NUMERIC_COMPARATOR_KEYS.includes(rule.comparator)) {
              return {
                ...staticAmplifierProps,

                isApplicable:
                  profileParameter instanceof Big &&
                  profileParameter[rule.comparator](rule.threshold),
              };
            } else return { ...staticAmplifierProps, isApplicable: false };
          }
        }
      }),

    [voterProfile, voteWeightAmplificationRules],
  );
};

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 *
 * Calculates the vote weight of a given participant in a given voting round.
 */
export const useVotingRoundVoterVoteWeight = ({ accountId, potId }: VotingRoundVoterKey) => {
  const { initialWeight, basicWeight } =
    // TODO: must be stored in a registry indexed by potId in the future ( Pots V2 milestone )
    VOTING_ROUND_CONFIG_MPDAO;

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
                    .mul(basicWeight ?? (accumulatedWeight.gt(0) ? accumulatedWeight : 1)),
                )
              : accumulatedWeight,

          Big(initialWeight),
        ),
      };
    }
  }, [accountId, voteWeightAmplifiers, initialWeight, basicWeight]);
};

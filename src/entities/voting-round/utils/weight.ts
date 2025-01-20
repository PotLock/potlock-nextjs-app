import { Big } from "big.js";
import { pick, prop, sortBy } from "remeda";

import type {
  VoterProfile,
  VotingMechanismConfig,
  VotingRoundVoteWeightAmplifier,
  VotingRoundWinner,
} from "../types";

export const getVoteWeightAmplifiers = (
  voterProfile: VoterProfile,
  { voteWeightAmplificationRules }: VotingMechanismConfig,
): VotingRoundVoteWeightAmplifier[] => {
  return voteWeightAmplificationRules.map((rule) => {
    const profileParameter = voterProfile[rule.voterProfileParameter];

    const staticAmplifierProps = pick(rule, [
      "name",
      "description",
      "criteria",
      "amplificationPercent",
    ]);

    if (profileParameter === undefined) {
      return { ...staticAmplifierProps, isApplicable: false };
    } else {
      switch (rule.comparator) {
        case "boolean": {
          return {
            ...staticAmplifierProps,

            isApplicable:
              typeof profileParameter === "boolean" && profileParameter === rule.expectation,
          };
        }

        default: {
          if (profileParameter instanceof Big) {
            return {
              ...staticAmplifierProps,
              isApplicable: profileParameter[rule.comparator](rule.threshold),
            };
          } else {
            return { ...staticAmplifierProps, isApplicable: false };
          }
        }
      }
    }
  });
};

// TODO: Refactor by replacing forEach with reduce
export const getVoteWeight = (
  voterProfile: VoterProfile,
  { basicWeight, initialWeight, voteWeightAmplificationRules }: VotingMechanismConfig,
) => {
  if (!voterProfile) return Big(initialWeight);

  let weight = Big(initialWeight);

  voteWeightAmplificationRules.forEach((rule) => {
    const profileParameter = voterProfile[rule.voterProfileParameter];

    let isApplicable = false;

    switch (rule.comparator) {
      case "boolean": {
        if (typeof profileParameter === "boolean") {
          isApplicable = profileParameter === rule.expectation;
        }

        break;
      }

      default: {
        if (profileParameter instanceof Big) {
          isApplicable = profileParameter[rule.comparator](rule.threshold);

          // TODO: Remove after backend fix
          //! TEMPORARILY mitigate the issue where the backend kept track of the staked amount even after the voting round
          isApplicable = voterProfile.accountId === "satoukibijusu.near" ? true : isApplicable;
        }
      }
    }

    if (isApplicable) {
      weight = weight.add(
        Big(rule.amplificationPercent)
          .div(100)
          .mul(basicWeight ?? 1),
      );
    }
  });

  return weight;
};

export const sortByAccumulatedWeight = (
  data: VotingRoundWinner[],
  order: "asc" | "desc" | undefined = "asc",
) => sortBy(data, [prop("accumulatedWeight"), order]);

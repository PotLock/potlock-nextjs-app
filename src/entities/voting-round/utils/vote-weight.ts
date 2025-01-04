import { Big } from "big.js";

import type { VoterProfile, VotingMechanismConfig } from "../types";

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

import { evolve, pick, pipe } from "remeda";

import { nullifyEmptyStrings } from "@/common/lib";
import { getLinktreeLeafExtractor } from "@/entities/_shared/account";

import type { ProfileSetupInputs } from "../models/types";

export const stripLinktree = evolve({
  twitter: getLinktreeLeafExtractor("twitter"),
  telegram: getLinktreeLeafExtractor("telegram"),
  github: getLinktreeLeafExtractor("github"),
  website: getLinktreeLeafExtractor("website"),
});

export const profileSetupInputsToSocialDbFormat = (inputs: ProfileSetupInputs) => ({
  /**
   ** Standard NEAR Social profile details
   */

  ...pick(inputs, ["name", "description"]),
  ...(inputs.profileImage ? { image: inputs.profileImage } : {}),
  ...(inputs.backgroundImage ? { backgroundImage: inputs.backgroundImage } : {}),

  linktree: pipe(
    inputs,
    pick(["website", "twitter", "telegram", "github"]),
    stripLinktree,
    nullifyEmptyStrings,
  ),

  /**
   ** POTLOCK-specific profile inputs
   */

  plCategories: JSON.stringify(inputs.categories),
  plFundingSources: inputs.fundingSources ? JSON.stringify(inputs.fundingSources) : undefined,
  plGithubRepos: inputs.githubRepositories ? JSON.stringify(inputs.githubRepositories) : undefined,
  plPublicGoodReason: inputs.publicGoodReason,
  plSmartContracts: inputs.smartContracts ? JSON.stringify(inputs.smartContracts) : undefined,
  plTeam: (inputs?.teamMembers ?? []).length > 0 ? JSON.stringify(inputs.teamMembers) : undefined,
});

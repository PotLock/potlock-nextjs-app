import { pick } from "remeda";

import { ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC } from "@/entities/_shared/account";

import type { ProfileSetupInputs } from "../models/types";

export const profileSetupFormInputsToSocialDbProfileUpdate = (inputs: ProfileSetupInputs) => ({
  /**
   *? Standard NEAR Social profile details
   */

  ...pick(inputs, ["name", "description"]),
  image: inputs.profileImage ?? ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,
  ...(inputs.backgroundImage ? { backgroundImage: inputs.backgroundImage } : {}),
  linktree: pick(inputs, ["website", "twitter", "telegram", "github"]),

  /**
   *? POTLOCK-specific profile inputs
   */

  plCategories: JSON.stringify(inputs.categories),
  plFundingSources: inputs.fundingSources ? JSON.stringify(inputs.fundingSources) : undefined,

  plGithubRepos: inputs.githubRepositories ? JSON.stringify(inputs.githubRepositories) : undefined,

  plPublicGoodReason: inputs.publicGoodReason,
  plSmartContracts: inputs.smartContracts ? JSON.stringify(inputs.smartContracts) : undefined,
  plTeam: JSON.stringify(inputs.teamMembers),
});

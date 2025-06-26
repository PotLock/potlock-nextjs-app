import { socialDbContractHooks } from "@/common/contracts/social-db";
import type { ByAccountId, ConditionalActivation, LiveUpdateParams } from "@/common/types";

import {
  ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,
  ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC,
} from "../constants";
import { useAccountSocialImageSrc } from "./social-image";

export const useAccountSocialProfile = ({
  accountId,
  enabled = true,
  live = false,
}: ByAccountId & ConditionalActivation & LiveUpdateParams) => {
  const {
    isLoading,
    isValidating,
    data,
    mutate: refetch,
    error,
  } = socialDbContractHooks.useSocialProfile({ enabled, live, accountId });

  const avatar = useAccountSocialImageSrc({
    data: data?.image,
    fallbackUrl: ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC,
  });

  const cover = useAccountSocialImageSrc({
    data: data?.backgroundImage,
    fallbackUrl: ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,
  });

  return {
    isLoading,
    isValidating,
    profile: data ?? undefined,
    avatar,
    cover,
    refetch,
    error,
  };
};

import { socialDbContractHooks } from "@/common/contracts/social-db";
import type { ByAccountId, ConditionalActivation } from "@/common/types";

import {
  ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,
  ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC,
} from "../constants";
import { useAccountSocialImageUrl } from "./social-image";

export const useAccountSocialProfile = ({
  accountId,
  enabled = true,
}: ByAccountId & ConditionalActivation) => {
  const {
    isLoading,
    isValidating,
    data,
    mutate: refetch,
    error,
  } = socialDbContractHooks.useSocialProfile({ enabled, accountId });

  const avatarSrc = useAccountSocialImageUrl({
    data: data?.image,
    fallbackUrl: ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC,
  });

  const backgroundSrc = useAccountSocialImageUrl({
    data: data?.backgroundImage,
    fallbackUrl: ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,
  });

  return {
    isLoading,
    isValidating,
    profile: data ?? undefined,
    avatarSrc: avatarSrc ?? ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC,
    backgroundSrc: backgroundSrc,
    refetch,
    error,
  };
};

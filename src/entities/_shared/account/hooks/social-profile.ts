import { useMemo } from "react";

import { socialDbContractHooks } from "@/common/contracts/social";
import type { ByAccountId, ConditionalActivation } from "@/common/types";

import {
  ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,
  ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC,
} from "../constants";

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

  const avatarSrc = useMemo(
    () =>
      (typeof data?.image === "string"
        ? data?.image
        : (data?.image?.url ??
          (data?.image?.ipfs_cid
            ? `https://ipfs.near.social/ipfs/${data?.image?.ipfs_cid}`
            : null))) ?? ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC,

    [data?.image],
  );

  const backgroundSrc = useMemo(
    () =>
      (typeof data?.backgroundImage === "string"
        ? data?.backgroundImage
        : (data?.backgroundImage?.url ??
          (data?.backgroundImage?.ipfs_cid
            ? `https://ipfs.near.social/ipfs/${data?.backgroundImage?.ipfs_cid}`
            : null))) ?? ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,

    [data?.backgroundImage],
  );

  return {
    isLoading,
    isValidating,
    profile: data ?? undefined,
    avatarSrc,
    backgroundSrc,
    refetch,
    error,
  };
};

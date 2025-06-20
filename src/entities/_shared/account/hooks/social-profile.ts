import { useMemo } from "react";

import { NOOP_STRING } from "@/common/constants";
import { socialDbContractHooks } from "@/common/contracts/social-db";
import { nftContractHooks } from "@/common/contracts/tokens";
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

  const avatarNftParams = useMemo(
    () =>
      data?.image !== undefined && typeof data.image !== "string" && "nft" in data.image
        ? (data.image.nft ?? null)
        : null,

    [data?.image],
  );

  const { data: avatarNft } = nftContractHooks.useToken({
    enabled: avatarNftParams !== null,
    contractAccountId: avatarNftParams?.contractId ?? NOOP_STRING,
    tokenId: avatarNftParams?.tokenId ?? NOOP_STRING,
  });

  console.log("avatarNft", avatarNft);

  const avatarSrc = useMemo(() => {
    if (avatarNft !== undefined) {
      return avatarNft.metadata.media;
    } else if (typeof data?.image === "string") {
      return data?.image;
    } else {
      return (
        data?.image?.url ??
        (data?.image?.ipfs_cid ? `https://ipfs.near.social/ipfs/${data?.image?.ipfs_cid}` : null)
      );
    }
  }, [avatarNft, data?.image]);

  const backgroundNft = useMemo(
    () =>
      data?.backgroundImage !== undefined &&
      typeof data.backgroundImage !== "string" &&
      "nft" in data.backgroundImage
        ? (data.backgroundImage.nft ?? null)
        : null,

    [data?.backgroundImage],
  );

  const backgroundSrc = useMemo(
    () =>
      typeof data?.backgroundImage === "string"
        ? data?.backgroundImage
        : (data?.backgroundImage?.url ??
          (data?.backgroundImage?.ipfs_cid
            ? `https://ipfs.near.social/ipfs/${data?.backgroundImage?.ipfs_cid}`
            : null)),

    [data?.backgroundImage],
  );

  return {
    isLoading,
    isValidating,
    profile: data ?? undefined,
    avatarSrc: avatarSrc ?? ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC,
    backgroundSrc: backgroundSrc ?? ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,
    refetch,
    error,
  };
};

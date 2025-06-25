import { useMemo } from "react";

import { isNonNullish } from "remeda";

import { NOOP_STRING } from "@/common/constants";
import type { NEARSocialUserProfile } from "@/common/contracts/social-db";
import { nftContractHooks } from "@/common/contracts/tokens";

export type UseAccountSocialImageParams = {
  data?: NEARSocialUserProfile["image"];
  fallbackUrl: string;
};

export const useAccountSocialImageSrc = ({ data, fallbackUrl }: UseAccountSocialImageParams) => {
  const nftParams = useMemo(
    () =>
      data !== undefined && typeof data !== "string" && "nft" in data ? (data.nft ?? null) : null,

    [data],
  );

  const { data: nft } = nftContractHooks.useToken({
    enabled: nftParams !== null,
    contractAccountId: nftParams?.contractId ?? NOOP_STRING,
    tokenId: nftParams?.tokenId ?? NOOP_STRING,
  });

  const rawImageSrc = useMemo(() => {
    if (typeof data !== "string") {
      return (
        data?.url ?? (data?.ipfs_cid ? `https://ipfs.near.social/ipfs/${data?.ipfs_cid}` : null)
      );
    } else return data;
  }, [data]);

  return useMemo(
    () => ({
      url: nft?.metadata.media ?? rawImageSrc ?? fallbackUrl,
      isNft: isNonNullish(nft),
    }),

    [fallbackUrl, nft, rawImageSrc],
  );
};

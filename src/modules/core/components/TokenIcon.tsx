import Image from "next/image";

import { pagoda } from "@/common/api/pagoda";
import NearIcon from "@/common/assets/svgs/near-icon";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { AccountId } from "@/common/types";

export type TokenIconProps = {
  /**
   * Either "NEAR" or FT contract account id.
   */
  tokenId: "near" | AccountId;
};

export const TokenIcon = ({ tokenId }: TokenIconProps) => {
  const { data: token, isLoading } = pagoda.useTokenMetadata({ tokenId });

  console.log(token);

  return tokenId === NEAR_TOKEN_DENOM ? (
    <NearIcon />
  ) : (
    <>
      {token?.icon ? (
        <Image
          alt={`Token icon for ${token.name}`}
          src={token?.icon}
          width={20}
          height={20}
        />
      ) : (
        <span className="prose text-5">
          {token?.name ?? !isLoading ? "⋯" : tokenId}
        </span>
      )}
    </>
  );
};

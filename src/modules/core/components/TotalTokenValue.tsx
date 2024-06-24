import { pagoda } from "@/common/api/pagoda";
import {
  NEAR_DEFAULT_TOKEN_DECIMALS,
  NEAR_TOKEN_DENOM,
} from "@/common/constants";
import { bigNumToFloat } from "@/common/lib";
import { ByTokenId } from "@/common/types";
import { Skeleton } from "@/common/ui/components";

import { TokenIcon } from "./TokenIcon";
import { useNearUsdDisplayValue } from "../hooks/price";

export type TotalTokenValueProps = ByTokenId &
  ({ amountFloat: number } | { amountBig: number });

export const TotalTokenValue = ({
  tokenId,
  ...props
}: TotalTokenValueProps) => {
  const { isLoading: isTokenMetadataLoading, data: tokenMetadata } =
    pagoda.useTokenMetadata({
      tokenId,
    });

  const amount =
    "amountFloat" in props
      ? props.amountFloat
      : bigNumToFloat(
          props.amountBig.toString(),
          tokenMetadata?.decimals ?? NEAR_DEFAULT_TOKEN_DECIMALS,
        );

  const totalNearAmountUsdDisplayValue = useNearUsdDisplayValue(amount);

  const totalAmountUsdDisplayValue =
    tokenId === NEAR_TOKEN_DENOM ? totalNearAmountUsdDisplayValue : null;

  return (
    <div un-flex="~" un-items="center" un-gap="2">
      <TokenIcon {...{ tokenId }} />

      {isTokenMetadataLoading ? (
        <Skeleton className="" />
      ) : (
        <span
          className="prose line-height-none"
          un-mt="0.7"
          un-text="xl"
          un-font="600"
        >{`${amount} ${tokenMetadata?.symbol ?? "⋯"}`}</span>
      )}

      {totalAmountUsdDisplayValue && (
        <span
          className="prose line-height-none"
          un-mt="0.7"
          un-text="gray-500 xl"
        >
          {totalAmountUsdDisplayValue}
        </span>
      )}
    </div>
  );
};

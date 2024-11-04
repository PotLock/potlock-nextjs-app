import { pagoda } from "@/common/api/pagoda";
import {
  NEAR_DEFAULT_TOKEN_DECIMALS,
  NEAR_TOKEN_DENOM,
} from "@/common/constants";
import { bigStringToFloat } from "@/common/lib";
import { ByTokenId } from "@/common/types";
import { Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

import { TokenIcon } from "./TokenIcon";
import { useNearUsdDisplayValue } from "../hooks/price";

export type TokenTotalValueProps = ByTokenId &
  ({ amountFloat: number } | { amountBigString: string }) & {
    textOnly?: boolean;
    classNames?: { root?: string; amount?: string };
  };

export const TokenTotalValue: React.FC<TokenTotalValueProps> = ({
  tokenId,
  textOnly = false,
  classNames,
  ...props
}) => {
  const { isLoading: isTokenMetadataLoading, data: tokenMetadata } =
    pagoda.useTokenMetadata({ tokenId });

  const amount =
    "amountFloat" in props
      ? props.amountFloat
      : bigStringToFloat(
          props.amountBigString,
          tokenMetadata?.decimals ?? NEAR_DEFAULT_TOKEN_DECIMALS,
        );

  const totalNearAmountUsdDisplayValue = useNearUsdDisplayValue(amount);

  const totalAmountUsdDisplayValue =
    tokenId === NEAR_TOKEN_DENOM ? totalNearAmountUsdDisplayValue : null;

  return (
    <div className={cn("flex items-center gap-2", classNames?.root)}>
      {!textOnly && <TokenIcon size="medium" {...{ tokenId }} />}

      {isTokenMetadataLoading ? (
        <Skeleton className="" />
      ) : (
        <span
          className={cn(
            "prose line-height-none font-600 text-xl",
            { "mt-0.7": !textOnly },
            classNames?.amount,
          )}
        >{`${amount} ${tokenMetadata?.symbol ?? "⋯"}`}</span>
      )}

      {totalAmountUsdDisplayValue && (
        <span
          className="prose line-height-none mt-0.7 text-xl text-neutral-600"
          un-mt="0.7"
        >
          {totalAmountUsdDisplayValue}
        </span>
      )}
    </div>
  );
};

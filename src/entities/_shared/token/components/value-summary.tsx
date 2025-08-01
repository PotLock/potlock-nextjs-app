import { NATIVE_TOKEN_DECIMALS } from "@/common/constants";
import { indivisibleUnitsToFloat } from "@/common/lib";
import { ByTokenId } from "@/common/types";
import { Skeleton } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";

import { TokenIcon } from "./icons";
import { useFungibleToken } from "../hooks/fungible";

export type TokenValueSummaryProps = ByTokenId &
  ({ amountFloat: number } | { amountIndivisible: string }) & {
    textOnly?: boolean;
    classNames?: { root?: string; amount?: string };
  };

export const TokenValueSummary: React.FC<TokenValueSummaryProps> = ({
  tokenId,
  textOnly = false,
  classNames,
  ...props
}) => {
  const { data: token } = useFungibleToken({ tokenId });

  const amount =
    "amountFloat" in props
      ? props.amountFloat
      : indivisibleUnitsToFloat(
          props.amountIndivisible,
          token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
        );

  return (
    <div className={cn("flex items-center gap-2", classNames?.root)}>
      {!textOnly && <TokenIcon size="md" {...{ tokenId }} />}

      {token ? (
        <span
          className={cn(
            "prose line-height-none font-600 text-xl",
            { "mt-0.7": !textOnly },
            classNames?.amount,
          )}
        >{`${amount} ${token.metadata.symbol}`}</span>
      ) : (
        <Skeleton className="w-35 h-5" />
      )}

      {token?.usdPrice && (
        <span
          className={cn("prose line-height-none text-xl text-neutral-600", { "mt-0.7": !textOnly })}
        >
          {`~$ ${token.usdPrice.mul(amount).toFixed(2)}`}
        </span>
      )}
    </div>
  );
};

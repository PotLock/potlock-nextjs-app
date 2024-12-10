import { NATIVE_TOKEN_DECIMALS } from "@/common/constants";
import { stringifiedU128ToFloat } from "@/common/lib";
import { ftService } from "@/common/services";
import { ByTokenId } from "@/common/types";
import { Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

import { TokenIcon } from "./TokenIcon";

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
  const { data: token } = ftService.useRegisteredToken({ tokenId });

  const amount =
    "amountFloat" in props
      ? props.amountFloat
      : stringifiedU128ToFloat(
          props.amountBigString,
          token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
        );

  const amountUsd = token?.usdPrice?.gt(0) ? token?.usdPrice?.mul(amount).toFixed(2) : null;

  return (
    <div className={cn("flex items-center gap-2", classNames?.root)}>
      {!textOnly && <TokenIcon size="medium" {...{ tokenId }} />}

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

      {amountUsd ? (
        <span
          className={cn("prose line-height-none text-xl text-neutral-600", { "mt-0.7": !textOnly })}
        >
          {`~$ ${amountUsd}`}
        </span>
      ) : (
        <Skeleton className="w-35 h-5" />
      )}
    </div>
  );
};

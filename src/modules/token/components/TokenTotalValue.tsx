import { NATIVE_TOKEN_DECIMALS } from "@/common/constants";
import { bigStringToFloat } from "@/common/lib";
import { ftService } from "@/common/services";
import { ByTokenId } from "@/common/types";
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
      : bigStringToFloat(
          props.amountBigString,
          token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
        );

  const totalAmountUsdValue = ftService.useTokenUsdDisplayValue({
    amountFloat: amount,
    tokenId,
  });

  return (
    <div className={cn("flex items-center gap-2", classNames?.root)}>
      {!textOnly && <TokenIcon size="medium" {...{ tokenId }} />}

      {
        <span
          className={cn(
            "prose line-height-none font-600 text-xl",
            { "mt-0.7": !textOnly },
            classNames?.amount,
          )}
        >{`${amount} ${token?.metadata.symbol ?? "⋯"}`}</span>
      }

      {totalAmountUsdValue && (
        <span
          className="prose line-height-none mt-0.7 text-xl text-neutral-600"
          un-mt="0.7"
        >
          {totalAmountUsdValue}
        </span>
      )}
    </div>
  );
};

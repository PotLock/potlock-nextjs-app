import { ByTokenId } from "@/common/types";
import { Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

import { useTokenBalance } from "../hooks/balance";

export type TokenBalanceProps = ByTokenId & {
  classNames?: { root?: string; amount?: string };
};

export const TokenBalance: React.FC<TokenBalanceProps> = ({
  tokenId,
  classNames,
}) => {
  const { isBalanceLoading, balanceString } = useTokenBalance({ tokenId });

  return balanceString === null ? (
    <>
      {isBalanceLoading ? (
        <Skeleton className="w-34 h-5" />
      ) : (
        <span
          className={cn("prose text-sm text-destructive", classNames?.amount)}
        >
          {"Unable to load available balance"}
        </span>
      )}
    </>
  ) : (
    <div className={cn("flex items-baseline gap-2", classNames?.root)}>
      <span className={cn("prose font-600 text-sm", classNames?.amount)}>
        {balanceString}
      </span>

      <span className="prose text-sm text-neutral-600">{"available"}</span>
    </div>
  );
};

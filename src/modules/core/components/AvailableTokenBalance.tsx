import { ByTokenId } from "@/common/types";
import { Skeleton } from "@/common/ui/components";

import { useAvailableBalance } from "../hooks/balance";

export const AvailableTokenBalance = ({ tokenId }: ByTokenId) => {
  const { isBalanceLoading, balanceString } = useAvailableBalance({ tokenId });

  return balanceString === null ? (
    <>
      {isBalanceLoading ? (
        <Skeleton className="w-34 h-5" />
      ) : (
        <span className="prose" un-text="sm destructive">
          Unable to load available balance!
        </span>
      )}
    </>
  ) : (
    <div un-flex="~" un-gap="1">
      <span className="prose" un-text="sm neutral-950" un-font="600">
        {balanceString}
      </span>

      <span className="prose" un-text="sm neutral-600">
        available
      </span>
    </div>
  );
};

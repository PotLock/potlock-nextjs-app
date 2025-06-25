import { ByTokenId } from "@/common/types";
import { Skeleton } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { useFungibleToken } from "@/entities/_shared/token";

export type TokenBalanceProps = ByTokenId & {
  classNames?: { root?: string; amount?: string };
};

export const TokenBalance: React.FC<TokenBalanceProps> = ({ tokenId, classNames }) => {
  const viewer = useWalletUserSession();

  const { data: token, error: tokenError } = useFungibleToken({
    live: true,
    balanceCheckAccountId: viewer?.accountId,
    tokenId,
  });

  return token?.balanceFloat === undefined ? (
    <>
      {tokenError ? (
        <span className={cn("prose text-destructive text-sm", classNames?.amount)}>
          {tokenError.message ?? "Unable to fetch token balance."}
        </span>
      ) : (
        <Skeleton className="w-34 h-5" />
      )}
    </>
  ) : (
    <div className={cn("flex items-baseline gap-2", classNames?.root)}>
      <span className={cn("prose font-600 text-sm", classNames?.amount)}>
        {`${token.balanceFloat} ${token.metadata.symbol.toUpperCase()}`}
      </span>

      <span className="prose text-sm text-neutral-600">{"available"}</span>
    </div>
  );
};

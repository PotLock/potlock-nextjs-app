import { ftService } from "@/common/services";
import { ByTokenId } from "@/common/types";
import { Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

export type TokenBalanceProps = ByTokenId & {
  classNames?: { root?: string; amount?: string };
};

export const TokenBalance: React.FC<TokenBalanceProps> = ({
  tokenId,
  classNames,
}) => {
  const { data: token, error: tokenError } = ftService.useRegisteredToken({
    tokenId,
  });

  return !token ? (
    <>
      {tokenError ? (
        <span
          className={cn("prose text-sm text-destructive", classNames?.amount)}
        >
          {tokenError.message}
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

import { authService, tokenService } from "@/common/services";
import { ByTokenId } from "@/common/types";
import { Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

export type DonationTokenBalanceProps = ByTokenId & {
  classNames?: { root?: string; amount?: string };
};

export const DonationTokenBalance: React.FC<DonationTokenBalanceProps> = ({
  tokenId,
  classNames,
}) => {
  const userSession = authService.useUserSession();

  const { data: token, error: tokenError } = tokenService.useSupportedToken({
    balanceCheckAccountId: userSession?.accountId,
    tokenId,
  });

  return !token ? (
    <>
      {tokenError ? (
        <span className={cn("prose text-destructive text-sm", classNames?.amount)}>
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

import { useMemo } from "react";

import { pagoda } from "@/common/api/pagoda";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { walletApi } from "@/common/contracts";
import { ByTokenId } from "@/common/types";

import { balanceToFloat, balanceToString } from "../utils";

export type AvailableBalance = {
  isBalanceLoading: boolean;
  balanceFloat: number | null;
  balanceString: string | null;
};

export const useAvailableBalance = ({
  tokenId,
}: ByTokenId): AvailableBalance => {
  const { isLoading: isNearBalanceLoading, data: availableNearBalance } =
    pagoda.useNearAccountBalance({
      accountId: walletApi.accountId ?? "unknown",
    });

  const { isLoading: isFtBalanceLoading, data: availableFtBalances } =
    pagoda.useFtAccountBalances({
      accountId: walletApi.accountId ?? "unknown",
    });

  const data = useMemo(
    () =>
      (tokenId === NEAR_TOKEN_DENOM
        ? availableNearBalance
        : availableFtBalances?.find(
            (ftBalance) => ftBalance.contract_account_id === tokenId,
          )) ?? null,

    [availableFtBalances, availableNearBalance, tokenId],
  );

  const floatValue = useMemo(
    () =>
      data === null
        ? null
        : balanceToFloat(data?.amount, data?.metadata.decimals),

    [data],
  );

  return {
    isBalanceLoading: isNearBalanceLoading || isFtBalanceLoading,
    balanceFloat: floatValue,
    balanceString: data === null ? null : balanceToString(data),
  };
};

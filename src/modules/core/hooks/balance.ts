import { useEffect, useMemo, useState } from "react";

import { AccountView } from "near-api-js/lib/providers/provider";
import { piped, prop } from "remeda";

import { nearRpc, walletApi } from "@/common/api/near";
import { pagoda } from "@/common/api/pagoda";
import {
  NEAR_DEFAULT_TOKEN_DECIMALS,
  NEAR_TOKEN_DENOM,
} from "@/common/constants";
import { bigStringToFloat } from "@/common/lib";
import { ByTokenId } from "@/common/types";

export type AvailableBalance = {
  isBalanceLoading: boolean;
  balanceFloat: number | null;
  balanceString: string | null;
};

export const useAvailableBalance = ({
  tokenId = NEAR_TOKEN_DENOM,
}: Partial<ByTokenId>): AvailableBalance => {
  const [nearBalanceYoctoNear, setNearBalanceYoctoNear] = useState<
    string | null
  >(null);

  useEffect(
    () =>
      void nearRpc
        .query<AccountView>({
          request_type: "view_account",
          finality: "final",
          account_id: walletApi.accountId ?? "unknown",
        })
        .then(piped(prop("amount"), setNearBalanceYoctoNear)),

    [],
  );

  const { isLoading: isFtBalanceLoading, data: availableFtBalances } =
    pagoda.useFtAccountBalances({
      accountId: walletApi.accountId ?? "unknown",
    });

  const isNearBalanceLoading = nearBalanceYoctoNear === null;
  const isBalanceLoading = isNearBalanceLoading || isFtBalanceLoading;

  const data = useMemo(
    () =>
      (tokenId === NEAR_TOKEN_DENOM
        ? nearBalanceYoctoNear
        : availableFtBalances?.find(
            (ftBalance) => ftBalance.contract_account_id === tokenId,
          )) ?? null,

    [availableFtBalances, nearBalanceYoctoNear, tokenId],
  );

  const balanceFloat = useMemo(
    () =>
      data === null
        ? null
        : bigStringToFloat(
            typeof data === "string" ? data : data?.amount,

            typeof data === "string"
              ? NEAR_DEFAULT_TOKEN_DECIMALS
              : data.metadata.decimals,
          ),

    [data],
  );

  const symbol = useMemo(
    () =>
      data === null
        ? null
        : typeof data === "string"
          ? NEAR_TOKEN_DENOM
          : data.metadata.symbol,

    [data],
  );

  const balanceString =
    data === null ? null : `${balanceFloat} ${symbol?.toUpperCase()}`;

  return { isBalanceLoading, balanceFloat, balanceString };
};

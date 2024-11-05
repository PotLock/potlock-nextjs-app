import { useEffect, useMemo, useState } from "react";

import { AccountView } from "near-api-js/lib/providers/provider";
import { piped, prop } from "remeda";

import { nearRpc, walletApi } from "@/common/api/near";
import {
  NEAR_DEFAULT_TOKEN_DECIMALS,
  NEAR_TOKEN_DENOM,
} from "@/common/constants";
import { bigStringToFloat } from "@/common/lib";
import { ftService } from "@/common/services";
import { ByTokenId } from "@/common/types";

import { TokenAvailableBalance } from "../types";

export const useTokenBalance = ({
  tokenId = NEAR_TOKEN_DENOM,
}: Partial<ByTokenId>): TokenAvailableBalance => {
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

  const { isLoading: isFtRegistryLoading, data: supportedFts = {} } =
    ftService.useTokenRegistry();

  const isNearBalanceLoading = nearBalanceYoctoNear === null;
  const isBalanceLoading = isNearBalanceLoading || isFtRegistryLoading;

  const data = useMemo(
    () =>
      (tokenId === NEAR_TOKEN_DENOM
        ? nearBalanceYoctoNear
        : supportedFts[tokenId]) ?? null,

    [nearBalanceYoctoNear, supportedFts, tokenId],
  );

  const balanceFloat = useMemo(
    () =>
      data === null
        ? null
        : bigStringToFloat(
            typeof data === "string" ? data : (data?.balance ?? (0).toString()),

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

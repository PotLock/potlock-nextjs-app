import { MemoryCache } from "@wpdas/naxios";
import { Big } from "big.js";
import { AccountView } from "near-api-js/lib/providers/provider";

import { coingeckoClient } from "@/common/api/coingecko";
import { naxiosInstance, nearRpc } from "@/common/api/near";
import { PRICES_REQUEST_CONFIG, pricesClient } from "@/common/api/prices";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { isAccountId, stringifiedU128ToBigNum, stringifiedU128ToFloat } from "@/common/lib";
import { AccountId, ByAccountId, ByTokenId, FungibleTokenMetadata } from "@/common/types";

import { FT_NATIVE_TOKEN_BINDING } from "./constants";
import { FtData } from "./types";

export const getFtBoundNativeTokenData = async ({
  accountId,
}: Partial<ByAccountId>): Promise<FtData> => {
  const usdPrice = await coingeckoClient
    .get(`/simple/price?ids=${NATIVE_TOKEN_ID}&vs_currencies=usd`)
    .then((response: { data: { [key: string]: { usd: number } } }) =>
      Big(response.data[NATIVE_TOKEN_ID].usd),
    )
    .catch(() => undefined);

  return typeof accountId === "string" && isAccountId(accountId)
    ? await nearRpc
        .query<AccountView>({
          request_type: "view_account",
          account_id: accountId,
          finality: "final",
        })
        .then(({ amount }) => {
          const balance = stringifiedU128ToBigNum(
            amount,
            FT_NATIVE_TOKEN_BINDING.metadata.decimals,
          );

          const balanceFloat = stringifiedU128ToFloat(
            amount,
            FT_NATIVE_TOKEN_BINDING.metadata.decimals,
          );

          const balanceUsd = balance?.gt(0) && usdPrice?.gt(0) ? balance?.mul(usdPrice) : Big(0);

          return {
            ...FT_NATIVE_TOKEN_BINDING,
            balance,
            balanceFloat,
            balanceUsd,

            balanceUsdStringApproximation: balanceUsd?.gt(0)
              ? `~$ ${balanceUsd.toFixed(2)}`
              : "$ 0",

            usdPrice,
          };
        })
    : { ...FT_NATIVE_TOKEN_BINDING, usdPrice };
};

export const getFtData = async ({
  accountId,
  tokenId,
}: Partial<ByAccountId> & ByTokenId): Promise<FtData | null> => {
  const ftContractClient = naxiosInstance.contractApi({
    contractId: tokenId,
    cache: new MemoryCache({ expirationTime: 120 }),
  });

  const metadata = await ftContractClient
    .view<{}, FungibleTokenMetadata>("ft_metadata")
    .catch(() => undefined);

  const [balanceRaw, usdPrice] = await Promise.all([
    typeof accountId === "string" && isAccountId(accountId)
      ? ftContractClient
          .view<
            { account_id: AccountId },
            string
          >("ft_balance_of", { args: { account_id: accountId } })
          .catch(() => undefined)
      : new Promise((resolve) => resolve(undefined)).then(() => undefined),

    pricesClient
      .getSuperPrecisePrice({ token_id: tokenId }, PRICES_REQUEST_CONFIG.axios)
      .then(({ data }) => Big(data))
      .catch(() => undefined),
  ]);

  const balance =
    metadata === undefined || balanceRaw === undefined
      ? undefined
      : stringifiedU128ToBigNum(balanceRaw, metadata.decimals);

  const balanceFloat =
    metadata === undefined || balanceRaw === undefined
      ? undefined
      : stringifiedU128ToFloat(balanceRaw, metadata.decimals);

  const balanceUsd = balance?.gt(0) && usdPrice?.gt(0) ? balance?.mul(usdPrice) : Big(0);

  return metadata === undefined
    ? null
    : {
        tokenId,
        metadata,
        balance,
        balanceFloat,
        balanceUsd,
        balanceUsdStringApproximation: balanceUsd?.gt(0) ? `~$ ${balanceUsd.toFixed(2)}` : "$ 0",
        usdPrice,
      };
};

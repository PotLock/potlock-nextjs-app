import { Big } from "big.js";
import { AccountView } from "near-api-js/lib/providers/provider";
import { filter, isNonNull, piped, reduce } from "remeda";
import { create } from "zustand";

import { coingeckoClient } from "@/common/api/coingecko";
import { PRICES_REQUEST_CONFIG, intearPricesClient } from "@/common/api/intear-prices";
import { naxiosInstance, nearRpc, walletApi } from "@/common/api/near/client";
import {
  NATIVE_TOKEN_DECIMALS,
  NATIVE_TOKEN_ICON_URL,
  NATIVE_TOKEN_ID,
  PLATFORM_LISTED_TOKEN_ACCOUNT_IDS,
} from "@/common/constants";
import { refExchangeClient } from "@/common/contracts/ref-finance";
import type { FungibleTokenMetadata } from "@/common/contracts/tokens";
import { isAccountId, stringifiedU128ToBigNum, stringifiedU128ToFloat } from "@/common/lib";
import { AccountId, ByAccountId, ByTokenId, type TokenId } from "@/common/types";

export type FtData = ByTokenId & {
  metadata: FungibleTokenMetadata;
  usdPrice?: Big.Big;
  balance?: Big.Big;
  balanceFloat?: number;
  balanceUsd?: Big.Big;
};

const FT_NATIVE_TOKEN_BINDING: FtData = {
  tokenId: NATIVE_TOKEN_ID,

  metadata: {
    spec: "",
    name: NATIVE_TOKEN_ID,
    symbol: NATIVE_TOKEN_ID.toUpperCase(),
    icon: NATIVE_TOKEN_ICON_URL,
    reference: null,
    reference_hash: null,
    decimals: NATIVE_TOKEN_DECIMALS,
  },
};

const getFtBoundNativeTokenData = async ({ accountId }: Partial<ByAccountId>): Promise<FtData> => {
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

          return { ...FT_NATIVE_TOKEN_BINDING, balance, balanceFloat, balanceUsd, usdPrice };
        })
    : { ...FT_NATIVE_TOKEN_BINDING, usdPrice };
};

const getFtData = async ({
  accountId,
  tokenId,
}: Partial<ByAccountId> & ByTokenId): Promise<FtData | null> => {
  const ftContractClient = naxiosInstance.contractApi({ contractId: tokenId });

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

    intearPricesClient
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
    : { tokenId, metadata, balance, balanceFloat, balanceUsd, usdPrice };
};

export type FtRegistry = Record<TokenId, FtData | undefined>;

type FtRegistryStoreState = {
  data?: FtRegistry;
  error?: unknown;
};

interface FtRegistryStore extends FtRegistryStoreState {}

export const useFtRegistryStore = create<FtRegistryStore>()(
  // persist(

  (set) =>
    refExchangeClient
      .get_whitelisted_tokens()
      .then((tokenContractAccountIds) =>
        Promise.all([
          getFtBoundNativeTokenData({ accountId: walletApi.accountId }),

          ...PLATFORM_LISTED_TOKEN_ACCOUNT_IDS.concat(tokenContractAccountIds).map((tokenId) =>
            getFtData({ accountId: walletApi.accountId, tokenId }),
          ),
        ]).then(
          piped(
            filter(isNonNull),

            reduce(
              (registryAccumulator, data: FtData) => ({
                ...registryAccumulator,
                [data.tokenId]: data,
              }),

              {},
            ),

            (data: FtRegistry) => set({ data }),
          ),
        ),
      )
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "object" && error !== null && "type" in error
              ? String((error as { type: string }).type)
              : String(error);

        set({
          error: new Error(errorMessage),
        });
      }),

  //   {
  //     name: "FT Registry",
  //     merge: (persistedState, currentState) => merge(persistedState, currentState),
  //   },
  // ),
);

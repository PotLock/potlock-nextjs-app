import { MemoryCache } from "@wpdas/naxios";
import { Big } from "big.js";
import { type AccountView } from "near-api-js/lib/providers/provider";
import { filter, fromEntries, isError, isNonNull, merge, piped } from "remeda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { coingeckoClient } from "@/common/api/coingecko";
import { naxiosInstance, nearRpc, walletApi } from "@/common/api/near";
import { PRICES_REQUEST_CONFIG, pricesClient } from "@/common/api/prices";
import {
  ICONS_ASSET_ENDPOINT_URL,
  NATIVE_TOKEN_DECIMALS,
  NATIVE_TOKEN_ID,
} from "@/common/constants";
import { refExchangeClient } from "@/common/contracts/ref-finance";
import { bigStringToFloat } from "@/common/lib";
import { AccountId, FungibleTokenMetadata, TokenId } from "@/common/types";

export type FtRegistryEntry = {
  contract_account_id: TokenId;
  metadata: FungibleTokenMetadata;
  balance?: Big.Big;
  balanceFloat?: number;
  balanceUsdApproximation?: string | null;
  usdPrice?: Big.Big;
};

const NATIVE_TOKEN_PSEUDO_FT_REGISTRY_ENTRY: FtRegistryEntry = {
  contract_account_id: NATIVE_TOKEN_ID,

  metadata: {
    spec: "",
    name: NATIVE_TOKEN_ID,
    symbol: NATIVE_TOKEN_ID.toUpperCase(),
    icon: `${ICONS_ASSET_ENDPOINT_URL}/near.svg`,
    reference: null,
    reference_hash: null,
    decimals: NATIVE_TOKEN_DECIMALS,
  },
};

export type FtRegistry = Record<TokenId, FtRegistryEntry | undefined>;

type FtRegistryStoreState = {
  data?: FtRegistry;
  error?: unknown;
};

interface FtRegistryStore extends FtRegistryStoreState {}

export const useFtRegistryStore = create<FtRegistryStore>()(
  persist(
    (set) => {
      refExchangeClient
        .get_whitelisted_tokens()
        .then((tokenContractAccountIds) =>
          Promise.all([
            nearRpc
              .query<AccountView>({
                request_type: "view_account",
                account_id: walletApi.accountId ?? "unknown",
                finality: "final",
              })
              .then(async ({ amount }) => {
                const balanceFloat = bigStringToFloat(
                  amount,
                  NATIVE_TOKEN_PSEUDO_FT_REGISTRY_ENTRY.metadata.decimals,
                );

                const balance = Big(balanceFloat);

                const usdPrice = await coingeckoClient
                  .get(`/simple/price?ids=${NATIVE_TOKEN_ID}&vs_currencies=usd`)
                  .then((response) => Big(response.data[NATIVE_TOKEN_ID].usd))
                  .catch(() => undefined);

                return [
                  NATIVE_TOKEN_ID,

                  {
                    ...NATIVE_TOKEN_PSEUDO_FT_REGISTRY_ENTRY,
                    balance,
                    balanceFloat,
                    balanceUsdApproximation: usdPrice?.mul(balance).toFixed(2),
                    usdPrice,
                  },
                ] as [TokenId, FtRegistryEntry];
              }),

            ...tokenContractAccountIds.map(async (contract_account_id) => {
              const ftClient = naxiosInstance.contractApi({
                contractId: contract_account_id,
                cache: new MemoryCache({ expirationTime: 600 }),
              });

              const metadata = await ftClient
                .view<{}, FungibleTokenMetadata>("ft_metadata")
                .catch(() => undefined);

              const [balanceRaw, usdPrice] =
                metadata === undefined
                  ? [undefined, undefined]
                  : await Promise.all([
                      ftClient
                        .view<{ account_id: AccountId }, string>(
                          "ft_balance_of",

                          {
                            args: {
                              account_id: walletApi.accountId ?? "unknown",
                            },
                          },
                        )
                        .catch(() => undefined),

                      pricesClient
                        .getSuperPrecisePrice(
                          { token_id: contract_account_id },
                          PRICES_REQUEST_CONFIG.axios,
                        )
                        .then(({ data }) => Big(data))
                        .catch(() => undefined),
                    ]);

              const balanceFloat =
                metadata === undefined || balanceRaw === undefined
                  ? undefined
                  : bigStringToFloat(balanceRaw, metadata.decimals);

              const balance = balanceFloat ? Big(balanceFloat) : undefined;

              return metadata === undefined
                ? null
                : ([
                    contract_account_id,
                    {
                      contract_account_id,
                      metadata,
                      balance,
                      balanceFloat,

                      balanceUsdApproximation:
                        balance?.gt(0) && usdPrice?.gt(0)
                          ? `~$ ${usdPrice.mul(balance).toFixed(2)}`
                          : null,

                      usdPrice,
                    },
                  ] as [TokenId, FtRegistryEntry]);
            }),
          ]).then(
            piped(
              filter(isNonNull),
              (registryEntries) => fromEntries(registryEntries),
              (data) => set({ data }),
            ),
          ),
        )
        .catch((error) =>
          set({
            error: isError(error)
              ? error
              : new Error(
                  "type" in error
                    ? (error as Record<string, unknown> & { type: string }).type
                    : error,
                ),
          }),
        );

      return { data: undefined, error: undefined };
    },

    {
      name: "FT Registry",

      merge: (persistedState, currentState) => merge(persistedState, currentState),
    },
  ),
);

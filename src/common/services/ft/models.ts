import { MemoryCache } from "@wpdas/naxios";
import { AccountView } from "near-api-js/lib/providers/provider";
import { filter, fromEntries, isNonNull, piped } from "remeda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { naxiosInstance, nearRpc, walletApi } from "@/common/api/near";
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
  balance?: string;
  balanceFloat?: number;
};

const NATIVE_TOKEN_FT_REGISTRY_ENTRY: FtRegistryEntry = {
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
              .then(
                ({ amount }) =>
                  [
                    NATIVE_TOKEN_ID,

                    {
                      ...NATIVE_TOKEN_FT_REGISTRY_ENTRY,
                      balance: amount,

                      balanceFloat: bigStringToFloat(
                        amount,
                        NATIVE_TOKEN_FT_REGISTRY_ENTRY.metadata.decimals,
                      ),
                    },
                  ] as [TokenId, FtRegistryEntry],
              ),

            ...tokenContractAccountIds.map(async (contract_account_id) => {
              const ftClient = naxiosInstance.contractApi({
                contractId: contract_account_id,
                cache: new MemoryCache({ expirationTime: 600 }),
              });

              const metadata = await ftClient
                .view<{}, FungibleTokenMetadata>("ft_metadata")
                .catch(() => undefined);

              const balance = await ftClient
                .view<{ account_id: AccountId }, string>("ft_balance_of", {
                  args: { account_id: walletApi.accountId ?? "unknown" },
                })
                .catch(() => undefined);

              return metadata === undefined
                ? null
                : ([
                    contract_account_id,
                    {
                      contract_account_id,
                      metadata,
                      balance,

                      balanceFloat:
                        balance === undefined
                          ? balance
                          : bigStringToFloat(balance, metadata.decimals),
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
        .catch((error) => set({ error }));

      return { data: undefined, error: undefined };
    },

    { name: "FT Registry" },
  ),
);

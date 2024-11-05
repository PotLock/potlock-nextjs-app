import { MemoryCache } from "@wpdas/naxios";
import { filter, fromEntries, isNonNull, piped } from "remeda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { naxiosInstance, walletApi } from "@/common/api/near";
import { refExchangeClient } from "@/common/contracts/ref-finance";
import { AccountId, FungibleTokenMetadata, TokenId } from "@/common/types";

export type FtRegistryEntry = {
  contract_account_id: TokenId;
  metadata: FungibleTokenMetadata;
  balance?: string;
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
          Promise.all(
            tokenContractAccountIds.map(async (contract_account_id) => {
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
                    { contract_account_id, metadata, balance },
                  ] as [TokenId, FtRegistryEntry]);
            }),
          ).then(
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

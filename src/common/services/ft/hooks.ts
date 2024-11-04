import { useEffect, useMemo } from "react";

import { MemoryCache } from "@wpdas/naxios";
import { filter, fromEntries, isNonNull, pick, piped } from "remeda";
import { useShallow } from "zustand/shallow";

import { naxiosInstance, walletApi } from "@/common/api/near";
import { refExchangeClient } from "@/common/contracts/ref-finance";
import { AccountId, FungibleTokenMetadata, TokenId } from "@/common/types";

import { FtRegistryEntry, useFtRegistryStore } from "./models";

export const useSupportedTokens = () => {
  const { data, error } = useFtRegistryStore(
    useShallow(pick(["data", "error"])),
  );

  const isLoading = useMemo(
    () => data === undefined && error === undefined,
    [data, error],
  );

  const { setData, setError } = useFtRegistryStore();

  useEffect(
    () =>
      void refExchangeClient
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
              setData,
            ),
          ),
        )
        .catch(setError),

    [setData, setError],
  );

  return { isLoading, data, error };
};

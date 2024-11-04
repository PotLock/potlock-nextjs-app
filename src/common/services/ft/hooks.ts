import { useEffect, useMemo } from "react";

import { MemoryCache } from "@wpdas/naxios";
import { filter, fromEntries, isNonNull, pick, piped } from "remeda";
import { useShallow } from "zustand/shallow";

import { naxiosInstance } from "@/common/api/near";
import { refExchangeClient } from "@/common/contracts/ref-finance";
import { FungibleTokenMetadata, TokenId } from "@/common/types";

import { useFtMetadataStore } from "./models";

export const useSupportedTokens = () => {
  const { data, error } = useFtMetadataStore(
    useShallow(pick(["data", "error"])),
  );

  const isLoading = useMemo(
    () => data === undefined && error === undefined,
    [data, error],
  );

  const { setData, setError } = useFtMetadataStore();

  useEffect(
    () =>
      void refExchangeClient
        .get_whitelisted_tokens()
        .then((tokenContractAccountIds) =>
          Promise.all(
            tokenContractAccountIds.map(async (contractAccountId) => {
              const metadata = await naxiosInstance
                .contractApi({
                  contractId: contractAccountId,
                  cache: new MemoryCache({ expirationTime: 600 }),
                })
                .view<{}, FungibleTokenMetadata>("ft_metadata")
                .catch(() => null);

              return metadata === null
                ? null
                : ([contractAccountId, metadata] as [
                    TokenId,
                    FungibleTokenMetadata,
                  ]);
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

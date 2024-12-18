import { filter, isNonNull, merge, piped, reduce } from "remeda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { walletApi } from "@/common/api/near/client";
import { PLATFORM_LISTED_TOKEN_ACCOUNT_IDS } from "@/common/constants";
import { refExchangeClient } from "@/common/contracts/ref-finance";
import type { FungibleTokenMetadata } from "@/common/contracts/tokens";
import type { ByTokenId, TokenId } from "@/common/types";

import * as ftClient from "./client";

export type FtData = ByTokenId & {
  metadata: FungibleTokenMetadata;
  usdPrice?: Big.Big;
  balance?: Big.Big;
  balanceFloat?: number;
  balanceUsd?: Big.Big;
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
          ftClient.getFtBoundNativeTokenData({ accountId: walletApi.accountId }),

          ...PLATFORM_LISTED_TOKEN_ACCOUNT_IDS.concat(tokenContractAccountIds).map((tokenId) =>
            ftClient.getFtData({ accountId: walletApi.accountId, tokenId }),
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

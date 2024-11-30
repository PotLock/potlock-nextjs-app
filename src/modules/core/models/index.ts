import { createModel } from "@rematch/core";
import { prop } from "remeda";

import { ContractMetadata } from "@/common/types";
import { useGlobalStoreSelector } from "@/store";
import { AppModel } from "@/store/models";

export * from "./schemas";

interface CoreState {
  contractMetadata: ContractMetadata;
  oneNearUsdPrice: number;
}

const initialState: CoreState = {
  contractMetadata: {
    latestSourceCodeCommitHash: null,
  },

  oneNearUsdPrice: 0,
};

export const core = createModel<AppModel>()({
  state: initialState,

  reducers: {
    setContractMetadata(state: CoreState, contractMetadata: ContractMetadata) {
      state.contractMetadata = contractMetadata;
    },

    updateOneNearUsdPrice(state: CoreState, oneNearUsdPrice: number) {
      state.oneNearUsdPrice = oneNearUsdPrice;
    },

    // Reset to the initial state
    RESET() {
      return initialState;
    },
  },

  effects: (dispatch) => ({
    async init() {
      const latestContractSourceCodeCommitHash = await fetch(
        "https://api.github.com/repos/PotLock/core/commits",
      );

      if (latestContractSourceCodeCommitHash.ok) {
        const data = await latestContractSourceCodeCommitHash.json();

        dispatch.core.setContractMetadata({
          latestSourceCodeCommitHash: data[0].sha,
        });
      }

      const coingeckoOneNearUsdPrice = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd",
        { cache: "force-cache" },
      );

      if (coingeckoOneNearUsdPrice.ok) {
        const data = await coingeckoOneNearUsdPrice.json();
        dispatch.core.updateOneNearUsdPrice(data.near.usd);
      }
    },
  }),
});

export const useCoreState = () => useGlobalStoreSelector(prop("core"));

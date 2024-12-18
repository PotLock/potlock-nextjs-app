import { createModel } from "@rematch/core";

import { ContractMetadata } from "@/common/types";
import { AppModel } from "@/store/models";

interface CoreState {
  contractMetadata: ContractMetadata;
}

const initialState: CoreState = {
  contractMetadata: {
    latestSourceCodeCommitHash: null,
  },
};

export const coreModel = createModel<AppModel>()({
  state: initialState,

  reducers: {
    setContractMetadata(state: CoreState, contractMetadata: ContractMetadata) {
      state.contractMetadata = contractMetadata;
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
    },
  }),
});

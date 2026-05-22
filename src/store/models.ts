import { Models, createModel } from "@rematch/core";

import { ContractMetadata } from "@/common/types";
import { campaignEditorModel } from "@/entities/campaign/models";
import { listEditorModel } from "@/entities/list";
import { donationModel, donationModelKey } from "@/features/donation";
import { potConfigurationModel, potConfigurationModelKey } from "@/features/pot-configuration";

interface CoreState {
  contractMetadata: ContractMetadata;
}

const initialState: CoreState = {
  contractMetadata: {
    latestSourceCodeCommitHash: null,
  },
};

export interface AppModel extends Models<AppModel> {
  core: typeof coreModel;
  [donationModelKey]: typeof donationModel;
  [potConfigurationModelKey]: typeof potConfigurationModel;
  listEditor: typeof listEditorModel;
  campaignEditor: typeof campaignEditorModel;
}

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
    async init(_: void) {
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

/**
 * @deprecated, use Zustand for stores instead
 */
export const models: AppModel = {
  core: coreModel,
  [donationModelKey]: donationModel,
  listEditor: listEditorModel,
  campaignEditor: campaignEditorModel,
  [potConfigurationModelKey]: potConfigurationModel,
};

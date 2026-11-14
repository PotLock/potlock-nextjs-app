import { createModel } from "@rematch/core";
import { mergeAll, prop } from "remeda";

import { Campaign } from "@/common/contracts/core/campaigns";
import { useGlobalStoreSelector } from "@/store/hooks";
import { type AppModel } from "@/store/models";

import { CampaignEditorState, CampaignEnumType } from "../types";
import { effects } from "./effects";

export const campaignModelKey = "campaignEditor";

const campaignEditorStateDefaults: CampaignEditorState = {
  type: CampaignEnumType.NONE,
  finalOutcome: { error: null },
  modalTextState: { header: "", description: "" },
};

const handleCampaign = (
  state: CampaignEditorState,
  stateUpdate?: Partial<CampaignEditorState>,
): CampaignEditorState =>
  mergeAll([
    state,
    {
      ...stateUpdate,
      type: stateUpdate?.type ?? state.type,
      finalOutcome: stateUpdate?.finalOutcome ?? state.finalOutcome,
      modalTextState: stateUpdate?.modalTextState ?? state.modalTextState,
    },
  ]) as CampaignEditorState;

export const useCampaignActionState = () => useGlobalStoreSelector(prop(campaignModelKey));

export const campaignEditorModel = createModel<AppModel>()({
  state: campaignEditorStateDefaults,
  effects: effects,
  reducers: {
    reset: () => campaignEditorStateDefaults,
    updateCampaignModalState: (state, { header, description, type }) =>
      handleCampaign(state, { type, modalTextState: { header, description } }),
    deploymentSuccess: (
      state,
      {
        data,
        type,
      }: {
        data: Campaign | undefined;
        type?: CampaignEnumType;
      },
    ) =>
      handleCampaign(state, {
        finalOutcome: { data, error: null },
        type,
      }),
  },
});

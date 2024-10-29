import { createModel } from "@rematch/core";
import { merge, mergeAll, prop } from "remeda";

import { List } from "@/common/api/indexer";
import { AccountId } from "@/common/types";
import { useTypedSelector } from "@/store";
import { AppModel } from "@/store/models";

import { effects } from "./effects";
import { ListEditorState, ListFormModalType } from "../types";

export const listModelKey = "listEditor";

const listEditorStateDefaults: ListEditorState = {
  type: ListFormModalType.NONE,
  finalOutcome: { error: null },
  modalTextState: { header: "", description: "" },
  donation: { amount: 0, breakdown: [], selectedProjects: [] },
};

export const useListActionsState = () => useTypedSelector(prop(listModelKey));

const handleList = (
  state: ListEditorState,
  stateUpdate?: Partial<ListEditorState>,
) => mergeAll([state, stateUpdate ?? {}]);

export const listEditorModel = createModel<AppModel>()({
  state: listEditorStateDefaults,
  effects,

  reducers: {
    reset: () => listEditorStateDefaults,
    handleUpdateDonationSuccess: (
      state,
      { amount, breakdown, selectedProjects, type },
    ) =>
      handleList(state, {
        donation: { amount, breakdown, selectedProjects },
        type,
      }),
    updateListModalState: (
      state,
      {
        header,
        description,
        type,
      }: { header: string; description: string; type: ListFormModalType },
    ) => handleList(state, { modalTextState: { header, description }, type }),
    handleListToast: (
      state,
      { name, type }: { name: string; type: ListFormModalType },
    ) => handleList(state, { name, type }),
    deploymentSuccess: (
      state,
      {
        data,
        accountId,
        type,
      }: {
        data: List | undefined;
        accountId?: AccountId;
        type?: ListFormModalType;
      },
    ) =>
      handleList(state, {
        finalOutcome: { data, accountId, error: null },
        type,
      }),

    deploymentFailure: (state, error: Error) =>
      handleList(state, {
        finalOutcome: { data: null, error },
      }),

    updateFailure: (state, error: Error) =>
      merge(state, {
        finalOutcome: { data: null, error },
      }),
  },
});

import { createModel } from "@rematch/core";
import { mergeAll } from "remeda";

import { StatusF24Enum } from "@/common/api/potlock";
import { AccountId } from "@/common/types";
import { AppModel } from "@/store/models";

export const potEditorModelKey = "toast";

interface ToastState {
  show: boolean;
  message: string;
  listType?: StatusF24Enum | string;
  account?: AccountId;
}

const toastDefaultState: ToastState = {
  show: false,
  message: "",
  listType: "NONE",
};

const handleToastState = (
  state: ToastState,
  stateUpdate?: Partial<ToastState>,
) => mergeAll([state, stateUpdate ?? {}]);

export const toastModel = createModel<AppModel>()({
  state: toastDefaultState,
  reducers: {
    reset: () => toastDefaultState,
    setListType: (state, listType: StatusF24Enum, account: AccountId) => ({
      ...state,
      listType,
      account,
    }),
    showToast: (
      state,
      { message, listType }: { message: string; listType?: StatusF24Enum },
    ) => handleToastState(state, { show: true, message, listType }),

    hideToast: (state) => handleToastState(state, { show: false, message: "" }),
  },
});

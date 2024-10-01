import { createModel } from "@rematch/core";
import { mergeAll } from "remeda";

import { StatusF24Enum } from "@/common/api/potlock";
import { AccountId } from "@/common/types";
import { ListFormModalType } from "@/modules/lists/types";
import { AppModel } from "@/store/models";

export const potEditorModelKey = "toast";

interface ToastState {
  show: boolean;
  message: string;
  listType?: StatusF24Enum | string;
  account?: AccountId;
  name?: string;
}

const toastDefaultState: ToastState = {
  show: false,
  message: "",
  listType: "NONE",
  name: "",
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
    upvoteSuccess: (
      state,
      {
        message,
        listType,
        name,
      }: { message: string; listType: ListFormModalType; name: string },
    ) => handleToastState(state, { show: true, message, listType, name }),
    showToast: (
      state,
      { message, listType }: { message: string; listType?: StatusF24Enum },
    ) => handleToastState(state, { show: true, message, listType }),

    hideToast: (state) => handleToastState(state, { show: false, message: "" }),
  },
});

import { Campaign } from "@/common/contracts/potlock";
import { AccountId } from "@/common/types";

export enum CampaignEnumType {
  NONE = "NONE",
  CREATE_CAMPAIGN = "CREATE_CAMPAIGN",
  UPDATE_CAMPAIGN = "UPDATE_CAMPAIGN",
  DELETE_CAMPAIGN = "DELETE_CAMPAIGN",
  DONATE_TO_CAMPAIGN = "DONATE_TO_CAMPAIGN",
}

export type CampaignEditorState = {
  type: CampaignEnumType;
  finalOutcome: {
    data?: Campaign | null;
    accountId?: AccountId;
    error: null | Error;
  };
  modalTextState: {
    header: string;
    description: string;
  };
};

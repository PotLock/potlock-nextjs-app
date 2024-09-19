import { DirectDonation, PotDonation } from "@/common/contracts/potlock";
import { ByStringId } from "@/common/types";
import { DonationBatchCallDraft } from "@/modules/donation";

export type CartItem = ByStringId & DonationBatchCallDraft;

export type CartOrderStep = "details" | "result";

export type CartOrderExecutionOutcome = DirectDonation | PotDonation;

export type CartState = {
  items: Record<CartItem["id"], CartItem>;
  orderStep: CartOrderStep;

  finalOutcome: {
    data?: null | CartOrderExecutionOutcome[];
    error: null | Error;
  };
};

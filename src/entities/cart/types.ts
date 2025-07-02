import type { DirectDonation } from "@/common/contracts/core/donation";
import type { PotDonation } from "@/common/contracts/core/pot";
import type { ByStringId } from "@/common/types";
import type { DonationBatchCallDraft } from "@/features/donation";

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

import { DonationOption, DonationType } from "./models";

export const DONATION_PARAMS: Record<DonationType, DonationOption> = {
  [DonationType.direct]: {
    title: "Direct donation",
    value: DonationType.direct,
  },

  [DonationType.pot]: {
    title: "Quadratically matched donation",
    hintIfDisabled: "(no pots available)",
    value: DonationType.pot,
  },
};

export const DONATION_TYPES = Object.values(DonationType);

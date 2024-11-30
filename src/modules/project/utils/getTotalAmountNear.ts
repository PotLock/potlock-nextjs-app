import { Big } from "big.js";

import { DirectDonation, PayoutDetailed, PotDonation } from "@/common/contracts/core";

export const getTotalAmountNear = (
  donations: (PotDonation | DirectDonation)[],
  potId?: string,
  payoutDetails?: PayoutDetailed,
) => {
  if (payoutDetails) return payoutDetails.totalAmount; // payout is set
  if (!donations) return "0";
  let totalDonationAmountNear = Big(0);
  for (const donation of donations) {
    if (
      ("ft_id" in donation && donation.ft_id === "near") || // For DirectDonation
      potId
    ) {
      totalDonationAmountNear = totalDonationAmountNear.plus(Big(donation.total_amount));
    }
  }
  return totalDonationAmountNear.toString();
};

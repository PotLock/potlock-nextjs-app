import { z } from "zod";

export const donationContractConfigSchema = z.object({
  owner: z.string(),
  protocol_fee_basis_points: z.number(),
  referral_fee_basis_points: z.number(),
  protocol_fee_recipient_account: z.string(),
});

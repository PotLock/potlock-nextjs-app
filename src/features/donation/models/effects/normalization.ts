import { floatToYoctoNear } from "@/common/lib";

import { DonationBatchCallDraft, DonationGroupAllocationStrategyEnum } from "../../types";
import { type DonationSubmitParams } from "../schemas";

// TODO: Split into two different functions for pot and list donations and convert them into effects
/**
 *! HEADS UP! This function currently only supports pot and list donations!
 */
export const donationInputsToBatchDonationDraft = ({
  potAccountId,
  listId,
  groupAllocationStrategy,
  groupAllocationPlan = [],
  referrerAccountId,
  bypassProtocolFee,
  bypassChefFee,
}: DonationSubmitParams): DonationBatchCallDraft => {
  const isDistributionManual =
    groupAllocationStrategy === DonationGroupAllocationStrategyEnum.manual;

  // TODO: better definition for the return type
  // @ts-expect-error runtime issues are not anticipated
  return {
    ...(listId ? {} : { potAccountId }),

    entries: groupAllocationPlan.reduce(
      (txs, { account_id, amount: donationAmount = 0 }) =>
        isDistributionManual && donationAmount === 0
          ? txs
          : txs.concat([
              {
                args: {
                  ...(potAccountId ? { project_id: account_id } : { recipient_id: account_id }),
                  ...(potAccountId && bypassChefFee ? { custom_chef_fee_basis_points: 0 } : {}),
                  referrer_id: referrerAccountId,
                  bypass_protocol_fee: bypassProtocolFee,
                },

                amountYoctoNear: floatToYoctoNear(donationAmount),
              },
            ]),

      [] as DonationBatchCallDraft["entries"],
    ),
  };
};

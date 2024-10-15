import { floatToYoctoNear } from "@/common/lib";

import { DonationInputs } from "../models";
import {
  DonationBatchCallDraft,
  DonationGroupAllocationStrategyEnum,
} from "../types";

export const donationInputsToBatchDonationDraft = ({
  potAccountId,
  listId,
  groupAllocationStrategy,
  groupAllocationPlan = [],
  referrerAccountId,
  bypassProtocolFee,
  bypassChefFee,
}: DonationInputs): DonationBatchCallDraft => {
  const isDistributionManual =
    groupAllocationStrategy === DonationGroupAllocationStrategyEnum.manually;

  // TODO: better definition for the return type
  // @ts-expect-error TODO ( runtime issues are not anticipated )
  return {
    ...(listId ? {} : { potAccountId }),

    entries: groupAllocationPlan.reduce(
      (txs, { account_id, amount: donationAmount = 0 }) =>
        isDistributionManual && donationAmount === 0
          ? txs
          : txs.concat([
              {
                args: {
                  project_id: account_id,
                  referrer_id: referrerAccountId,
                  bypass_protocol_fee: bypassProtocolFee,

                  ...(potAccountId && bypassChefFee
                    ? { custom_chef_fee_basis_points: 0 }
                    : {}),
                },

                amountYoctoNear: floatToYoctoNear(donationAmount),
              },
            ]),

      [] as DonationBatchCallDraft["entries"],
    ),
  };
};

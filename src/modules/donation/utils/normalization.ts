import { reduce } from "remeda";

import { PotId } from "@/common/api/potlock";
import { PotBatchDonationItem } from "@/common/contracts/potlock";
import { floatToYoctoNear } from "@/common/lib";

import { DonationInputs } from "../models";
import {
  DonationGroupAllocationStrategyEnum,
  DonationPotBatchCallDraft,
} from "../types";

export const potDonationInputsToBatchDonationDraft = ({
  potAccountId,
  groupAllocationStrategy,
  groupAllocationPlan = [],
  referrerAccountId,
  bypassProtocolFee,
  bypassChefFee,
}: DonationInputs & { potAccountId: PotId }): DonationPotBatchCallDraft => {
  const isDistributionManual =
    groupAllocationStrategy === DonationGroupAllocationStrategyEnum.manually;

  return {
    potAccountId,

    entries: reduce(
      groupAllocationPlan,

      (txs, { account_id, amount: donationAmount = 0 }) =>
        isDistributionManual && donationAmount === 0
          ? txs
          : txs.concat([
              {
                args: {
                  project_id: account_id,

                  referrer_id: referrerAccountId,
                  bypass_protocol_fee: bypassProtocolFee,
                  ...(bypassChefFee ? { custom_chef_fee_basis_points: 0 } : {}),
                },

                amountYoctoNear: floatToYoctoNear(donationAmount),
              },
            ]),

      [] as PotBatchDonationItem[],
    ),
  };
};

import { reduce } from "remeda";

import { PotId } from "@/common/api/potlock";
import { PotBatchDonationItem } from "@/common/contracts/potlock";
import { floatToYoctoNear } from "@/common/lib";

import { DonationInputs } from "../models";
import {
  DonationPotBatchCallDraft,
  DonationShareAllocationStrategyEnum,
} from "../types";

export const potDonationInputsToBatchDonationDraft = ({
  amount,
  potAccountId,
  potShareAllocationStrategy,
  potDonationShares = [],
  referrerAccountId,
  bypassProtocolFee,
  bypassChefFee,
}: DonationInputs & { potAccountId: PotId }): DonationPotBatchCallDraft => {
  const isDistributionManual =
    potShareAllocationStrategy === DonationShareAllocationStrategyEnum.manually;

  return {
    potAccountId,

    entries: reduce(
      potDonationShares,

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

                amountYoctoNear: isDistributionManual
                  ? floatToYoctoNear(donationAmount)
                  : floatToYoctoNear(amount),
              },
            ]),

      [] as PotBatchDonationItem[],
    ),
  };
};

import type { InformativeSuccessfulExecutionOutcome } from "@/common/blockchains/near-protocol";
import { type PotDonation, potContractClient } from "@/common/contracts/core/pot";
import { floatToYoctoNear } from "@/common/lib";
import type { AccountId } from "@/common/types";

import { DonationBatchCallDraft, DonationGroupAllocationStrategyEnum } from "../../types";
import { type DonationSubmitParams } from "../schemas";

type GroupPotDonationMulticallInputs = Pick<
  DonationSubmitParams,
  | "bypassChefFee"
  | "bypassProtocolFee"
  | "groupAllocationStrategy"
  | "groupAllocationPlan"
  | "referrerAccountId"
> & { potContractAccountId: AccountId };

export const groupPotDonationMulticall = ({
  potContractAccountId,
  bypassChefFee,
  bypassProtocolFee,
  groupAllocationStrategy,
  groupAllocationPlan = [],
  referrerAccountId,
}: GroupPotDonationMulticallInputs) => {
  const isDistributionManual =
    groupAllocationStrategy === DonationGroupAllocationStrategyEnum.manual;

  return potContractClient
    .donateBatch(
      potContractAccountId,

      groupAllocationPlan.reduce(
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

        [] as DonationBatchCallDraft["entries"],
      ),
    )
    .then((finalExecutionOutcomes = undefined) => {
      const receipts: PotDonation[] =
        finalExecutionOutcomes?.reduce(
          (acc, { status }) => {
            const decodedReceipt = atob(
              (status as InformativeSuccessfulExecutionOutcome["status"]).SuccessValue,
            );

            try {
              return [...acc, JSON.parse(decodedReceipt) as PotDonation];
            } catch {
              return acc;
            }
          },

          [] as PotDonation[],
        ) ?? [];

      if (receipts.length > 0) {
        return receipts;
      } else throw new Error("Unable to determine transaction execution status.");
    });
};

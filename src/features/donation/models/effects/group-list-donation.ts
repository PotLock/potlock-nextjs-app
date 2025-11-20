import type { InformativeSuccessfulExecutionOutcome } from "@/common/blockchains/near-protocol";
import {
  type DirectBatchDonationItem,
  type DirectDonation,
  donationContractClient,
} from "@/common/contracts/core/donation";
import { floatToYoctoNear } from "@/common/lib";

import { DonationGroupAllocationStrategyEnum } from "../../types";
import { type DonationSubmitParams } from "../schemas";

type GroupListDonationMulticallInputs = Pick<
  DonationSubmitParams,
  "groupAllocationStrategy" | "groupAllocationPlan" | "referrerAccountId" | "bypassProtocolFee"
> & {};

export const groupListDonationMulticall = ({
  groupAllocationStrategy,
  groupAllocationPlan = [],
  referrerAccountId,
  bypassProtocolFee,
}: GroupListDonationMulticallInputs): Promise<DirectDonation[]> => {
  const isDistributionManual =
    groupAllocationStrategy === DonationGroupAllocationStrategyEnum.manual;

  return donationContractClient
    .donateBatch(
      groupAllocationPlan.reduce(
        (txs, { account_id, amount: donationAmount = 0 }) =>
          isDistributionManual && donationAmount === 0
            ? txs
            : txs.concat([
                {
                  args: {
                    recipient_id: account_id,
                    referrer_id: referrerAccountId,
                    bypass_protocol_fee: bypassProtocolFee,
                  },

                  amountYoctoNear: floatToYoctoNear(donationAmount),
                },
              ]),

        [] as DirectBatchDonationItem[],
      ),
    )
    .then((finalExecutionOutcomes = undefined) => {
      const receipts: DirectDonation[] =
        finalExecutionOutcomes?.reduce(
          (acc, { status }) => {
            const decodedReceipt = atob(
              (status as InformativeSuccessfulExecutionOutcome["status"]).SuccessValue,
            );

            try {
              return [...acc, JSON.parse(decodedReceipt) as DirectDonation];
            } catch {
              return acc;
            }
          },

          [] as DirectDonation[],
        ) ?? [];

      if (receipts.length > 0) {
        return receipts;
      } else throw new Error("Unable to determine transaction execution status.");
    });
};

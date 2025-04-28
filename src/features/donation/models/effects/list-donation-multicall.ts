import type { ExecutionStatus } from "near-api-js/lib/providers/provider";
import { prop } from "remeda";

import { DONATION_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import type { InformativeSuccessfulExecutionOutcome } from "@/common/blockchains/near-protocol";
import {
  type DirectBatchDonationItem,
  type DirectDonation,
  donationContractClient,
} from "@/common/contracts/core/donation";
import { floatToYoctoNear } from "@/common/lib";

import { DonationGroupAllocationStrategyEnum } from "../../types";
import { type DonationSubmitParams } from "../schemas";

type ListDonationMulticallInputs = Pick<
  DonationSubmitParams,
  "groupAllocationStrategy" | "groupAllocationPlan" | "referrerAccountId" | "bypassProtocolFee"
> & {};

export const listDonationMulticall = ({
  groupAllocationStrategy,
  groupAllocationPlan = [],
  referrerAccountId,
  bypassProtocolFee,
}: ListDonationMulticallInputs): Promise<DirectDonation[]> => {
  const isDistributionManual =
    groupAllocationStrategy === DonationGroupAllocationStrategyEnum.manual;

  const recipientAccountIds = groupAllocationPlan.map(prop("account_id"));

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
      console.log("finalExecutionOutcomes", finalExecutionOutcomes);

      const receipts: DirectDonation[] =
        finalExecutionOutcomes
          ?.at(-1)
          ?.receipts_outcome.filter(
            ({ outcome: { executor_id, status } }) =>
              executor_id === DONATION_CONTRACT_ACCOUNT_ID &&
              "SuccessValue" in (status as ExecutionStatus) &&
              typeof (status as ExecutionStatus).SuccessValue === "string",
          )
          .reduce(
            (acc, { outcome }) => {
              const decodedReceipt = atob(
                (outcome as InformativeSuccessfulExecutionOutcome).status.SuccessValue,
              );

              /**
               *? Checking for the donation receipt signature
               */
              if (recipientAccountIds.some(decodedReceipt.includes)) {
                try {
                  return [JSON.parse(decodedReceipt) as DirectDonation];
                } catch {
                  return acc;
                }
              } else return acc;
            },

            [] as DirectDonation[],
          ) ?? [];

      if (receipts.length > 0) {
        return receipts;
      } else throw new Error("Unable to determine transaction execution status.");
    });
};

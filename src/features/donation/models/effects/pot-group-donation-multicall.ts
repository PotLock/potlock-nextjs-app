import type { ExecutionStatus } from "near-api-js/lib/providers/provider";
import { prop } from "remeda";

import type { InformativeSuccessfulExecutionOutcome } from "@/common/blockchains/near-protocol";
import { type PotDonation, potContractClient } from "@/common/contracts/core/pot";
import { floatToYoctoNear } from "@/common/lib";
import type { AccountId } from "@/common/types";

import { DonationBatchCallDraft, DonationGroupAllocationStrategyEnum } from "../../types";
import { type DonationSubmitParams } from "../schemas";

type PotDonationMulticallInputs = Pick<
  DonationSubmitParams,
  | "bypassChefFee"
  | "bypassProtocolFee"
  | "groupAllocationStrategy"
  | "groupAllocationPlan"
  | "referrerAccountId"
> & { potContractAccountId: AccountId };

export const potGroupDonationMulticall = ({
  potContractAccountId,
  bypassChefFee,
  bypassProtocolFee,
  groupAllocationStrategy,
  groupAllocationPlan = [],
  referrerAccountId,
}: PotDonationMulticallInputs) => {
  const isDistributionManual =
    groupAllocationStrategy === DonationGroupAllocationStrategyEnum.manual;

  const recipientAccountIds = groupAllocationPlan.map(prop("account_id"));

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
      console.log("finalExecutionOutcomes", finalExecutionOutcomes);

      const receipts: PotDonation[] =
        finalExecutionOutcomes
          ?.at(-1)
          ?.receipts_outcome.filter(
            ({ outcome: { executor_id, status } }) =>
              executor_id === potContractAccountId &&
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
                  return [JSON.parse(decodedReceipt) as PotDonation];
                } catch {
                  return acc;
                }
              } else return acc;
            },

            [] as PotDonation[],
          ) ?? [];

      if (receipts.length > 0) {
        return receipts;
      } else throw new Error("Unable to determine transaction execution status.");
    });
};

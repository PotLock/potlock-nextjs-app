import { syncApi } from "@/common/api/indexer";
import { walletApi } from "@/common/blockchains/near-protocol/client";
import {
  type DirectBatchDonateResult,
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

export const groupListDonationMulticall = async ({
  groupAllocationStrategy,
  groupAllocationPlan = [],
  referrerAccountId,
  bypassProtocolFee,
}: GroupListDonationMulticallInputs): Promise<DirectDonation[]> => {
  const isDistributionManual =
    groupAllocationStrategy === DonationGroupAllocationStrategyEnum.manual;

  const txInputs = groupAllocationPlan.reduce(
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
  );

  const result: DirectBatchDonateResult = await donationContractClient.donateBatch(txInputs);

  // Sync donations to indexer
  if (result.txHash && result.donations.length > 0) {
    const senderId = walletApi.accountId;

    if (senderId) {
      await syncApi.directDonation(result.txHash, senderId).catch(() => {});
    }
  }

  if (result.donations.length > 0) {
    return result.donations;
  } else {
    throw new Error("Unable to determine transaction execution status.");
  }
};

import { values } from "remeda";

import type { ByPotId } from "@/common/api/indexer";
import { potContractClient } from "@/common/contracts/core";
import type { FungibleTokenMetadata } from "@/common/contracts/tokens";
import { floatToIndivisible } from "@/common/lib";
import type { VotingRoundParticipants } from "@/entities/voting-round";

export type PayoutSubmitInputs = ByPotId & {
  tokenDecimals: FungibleTokenMetadata["decimals"];
  recipients: VotingRoundParticipants["winners"];
};

export const submitPayouts = ({ potId, tokenDecimals, recipients }: PayoutSubmitInputs) => {
  // TODO: Handle IPFS upload
  const payoutBreakdownJson = JSON.stringify(recipients);

  console.log(payoutBreakdownJson);

  return potContractClient.chef_set_payouts({
    potId,

    payouts: values(recipients).map(({ accountId, estimatedPayoutAmount }) => ({
      project_id: accountId,
      amount: floatToIndivisible(estimatedPayoutAmount, tokenDecimals),
    })),
  });
};

export const initiatePayoutProcessing = ({ potId }: ByPotId) =>
  potContractClient.admin_process_payouts({ potId });

import { values } from "remeda";

import type { ByPotId } from "@/common/api/indexer";
import { potContractClient } from "@/common/contracts/core/pot";
import type { VotingRoundParticipants } from "@/entities/voting-round";

export type PayoutSubmitInputs = ByPotId & {
  recipients: VotingRoundParticipants["winners"];
};

export const submitPayouts = ({ potId, recipients }: PayoutSubmitInputs) => {
  return potContractClient.chef_set_payouts({
    potId,

    payouts: values(recipients).map(({ accountId, estimatedPayoutAmount }) => ({
      project_id: accountId,
      amount: estimatedPayoutAmount,
    })),
  });
};

export const initiatePayoutProcessing = ({ potId }: ByPotId) =>
  potContractClient.admin_process_payouts({ potId });

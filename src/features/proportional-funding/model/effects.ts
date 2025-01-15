import type { ByPotId } from "@/common/api/indexer";
import { potContractClient } from "@/common/contracts/core";
import type { VotingRoundParticipants } from "@/entities/voting-round";

export type PayoutSubmitInputs = ByPotId & {
  recipients: VotingRoundParticipants["winners"];
};

export const submitPayouts = ({ potId, recipients }: PayoutSubmitInputs) => {
  // TODO: WIP
  return potContractClient.chef_set_payouts({ potId, payouts: [] });
};

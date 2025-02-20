import { type Transaction, calculateDepositByDataSize } from "@wpdas/naxios";
import { values } from "remeda";

import type { ByPotId } from "@/common/api/indexer";
import { FULL_TGAS } from "@/common/constants";
import { potContractClient } from "@/common/contracts/core/pot";
import { parseNearAmount } from "@/common/lib";
import { pinataClient } from "@/common/services/pinata";
import type { VotingRoundParticipants } from "@/entities/voting-round";

import type { PFPayoutJustificationInputs } from "./types";

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

export const publishPayoutJustification = async ({
  potId,
  votingRoundResult,
  challengerAccountId,
}: PFPayoutJustificationInputs) =>
  pinataClient
    .upload({
      file: new File(
        [new Blob([JSON.stringify(votingRoundResult)], { type: "application/json" })],
        `${potId}_payout-justification.json`,
      ),
    })
    .then(({ IpfsHash }) =>
      pinataClient.sdk.gateways.convert(IpfsHash).then((ipfsUrl) => {
        const args = {
          challenge_payouts: {
            reason: JSON.stringify({
              PayoutJustification: ipfsUrl,
            }),
          },

          admin_update_payouts_challenge: {
            challenger_id: challengerAccountId,
            resolve_challenge: true,
          },
        };

        return potContractClient.contractApi(potId).callMultiple([
          {
            method: "challenge_payouts",
            args: args.challenge_payouts,
            gas: FULL_TGAS,

            deposit: parseNearAmount(calculateDepositByDataSize(args.challenge_payouts)) ?? "0",
          } as Transaction<potContractClient.ChallengePayoutsArgs>,

          {
            method: "admin_update_payouts_challenge",
            args: args.admin_update_payouts_challenge,
            gas: FULL_TGAS,

            deposit:
              parseNearAmount(calculateDepositByDataSize(args.admin_update_payouts_challenge)) ??
              "0",
          } as Transaction<potContractClient.PayoutChallengeUpdateArgs>,
        ] as Transaction<object>[]);
      }),
    );

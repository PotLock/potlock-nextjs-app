import { walletApi } from "@/common/api/near";
import {
  DirectDonation,
  DirectDonationArgs,
  PotDonation,
  PotDonationArgs,
  donate,
  pot,
} from "@/common/contracts/potlock";
import { floatToYoctoNear } from "@/common/lib";
import { getTransactionStatus } from "@/common/services";
import { AppDispatcher } from "@/store";

import { DonationInputs } from "./schemas";
import {
  DonationAllocationStrategyEnum,
  DonationSubmissionInputs,
} from "../types";
import { potDonationInputsToBatchDonationDraft } from "../utils/normalization";

export const effects = (dispatch: AppDispatcher) => ({
  submit: async (
    inputs: DonationSubmissionInputs & DonationInputs,
  ): Promise<void> => {
    const {
      amount,
      allocationStrategy,
      potDonationPlan,
      referrerAccountId,
      bypassProtocolFee,
      bypassChefFee,
      message,
      ...params
    } = inputs;

    if ("accountId" in params) {
      switch (allocationStrategy) {
        case DonationAllocationStrategyEnum.direct: {
          const args: DirectDonationArgs = {
            recipient_id: params.accountId,
            message,
            referrer_id: referrerAccountId,
            bypass_protocol_fee: bypassProtocolFee,
          };

          return void donate
            .donate(args, floatToYoctoNear(amount))
            .then((result) => dispatch.donation.success(result))
            .catch((error) => dispatch.donation.failure(error));
        }

        case DonationAllocationStrategyEnum.pot: {
          if (!params.potAccountId) {
            return void dispatch.donation.failure(new Error("No pot selected"));
          }

          const args: PotDonationArgs = {
            project_id: params.accountId,
            message,
            referrer_id: referrerAccountId,
            bypass_protocol_fee: bypassProtocolFee,
            custom_chef_fee_basis_points: bypassChefFee ? 0 : undefined,
          };

          return void pot
            .donate(params.potAccountId, args, floatToYoctoNear(amount))
            .then(dispatch.donation.success)
            .catch((error) => dispatch.donation.failure(error));
        }
      }
    } else if ("potId" in params && potDonationPlan !== undefined) {
      const batchTxDraft = potDonationInputsToBatchDonationDraft({
        potAccountId: params.potId,
        ...inputs,
      });

      return void pot
        .donateBatch(batchTxDraft.potAccountId, batchTxDraft.entries)
        .then(/* dispatch.donation.success */ console.log)
        .catch(dispatch.donation.failure);
    } else {
      return void dispatch.donation.failure(
        new Error("Unable to determine donation type."),
      );
    }
  },

  handleOutcome: async (transactionHash: string): Promise<void> => {
    const { accountId: sender_account_id } = walletApi;

    if (sender_account_id) {
      const { data } = await getTransactionStatus({
        tx_hash: transactionHash,
        sender_account_id,
      });

      const donationData = JSON.parse(
        atob(data.result.receipts_outcome[3].outcome.status.SuccessValue),
      ) as DirectDonation | PotDonation;

      dispatch.donation.success(donationData);
    } else {
      dispatch.donation.failure(
        new Error(
          "Unable to get donation transaction status without user authentication." +
            "Please login and try again.",
        ),
      );
    }
  },
});

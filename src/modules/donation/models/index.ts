import { createModel } from "@rematch/core";

import { walletApi } from "@/common/api/near";
import { donateNearDirectly } from "@/common/contracts/potlock/donate";
import {
  DirectDonation,
  DirectDonationArgs,
} from "@/common/contracts/potlock/interfaces/donate.interfaces";
import {
  PotDonation,
  PotDonationArgs,
} from "@/common/contracts/potlock/interfaces/pot.interfaces";
import { donateNearViaPot } from "@/common/contracts/potlock/pot";
import { floatToYoctoNear } from "@/common/lib";
import { getTransactionStatus } from "@/common/services";
import { RootModel } from "@/store/models";

import { DonationInputs } from "./schemas";
import {
  DonationAllocationStrategy,
  DonationAllocationStrategyEnum,
  DonationAllocationStrategyOption,
  DonationPotDistributionStrategy,
  DonationState,
  DonationStep,
  DonationSubmissionInputs,
} from "../types";

export * from "./schemas";

export const donationAllocationStrategies: Record<
  DonationAllocationStrategy,
  DonationAllocationStrategyOption
> = {
  direct: {
    label: "Direct donation",
    value: DonationAllocationStrategyEnum.direct,
  },

  pot: {
    label: "Quadratically matched donation",
    hintIfDisabled: "(no pots available)",
    value: DonationAllocationStrategyEnum.pot,
  },
};

const donationStateDefaults: DonationState = {
  currentStep: "allocation",
};

const handleStep = (state: DonationState, step: DonationStep) => ({
  ...state,
  currentStep: step,
});

export const donationModel = createModel<RootModel>()({
  state: donationStateDefaults,

  reducers: {
    reset() {
      return donationStateDefaults;
    },

    nextStep(state) {
      switch (state.currentStep) {
        case "allocation":
          return handleStep(state, "confirmation");

        case "confirmation":
          return handleStep(state, "success");
      }
    },

    previousStep(state) {
      switch (state.currentStep) {
        case "confirmation":
          return handleStep(state, "allocation");
      }
    },

    success(state, result: DirectDonation | PotDonation) {
      return { ...handleStep(state, "success"), finalOutcome: result };
    },

    failure(_, error: Error) {
      console.error(error);
    },
  },

  effects: (dispatch) => ({
    async submit({
      amount,
      allocationStrategy,
      potDistributionStrategy,
      referrerAccountId,
      bypassProtocolFee,
      bypassChefFee,
      message,
      ...params
    }: DonationSubmissionInputs & DonationInputs): Promise<void> {
      if ("accountId" in params) {
        switch (allocationStrategy) {
          case DonationAllocationStrategyEnum.direct: {
            const args: DirectDonationArgs = {
              recipient_id: params.accountId,
              message,
              referrer_id: referrerAccountId,
              bypass_protocol_fee: bypassProtocolFee,
            };

            return void donateNearDirectly(args, floatToYoctoNear(amount))
              .then((result) => dispatch.donation.success(result))
              .catch((error) => dispatch.donation.failure(error));
          }

          case DonationAllocationStrategyEnum.pot: {
            if (!params.potAccountId) {
              return void dispatch.donation.failure(
                new Error("No pot selected"),
              );
            }

            const args: PotDonationArgs = {
              project_id: params.accountId,
              message,
              referrer_id: referrerAccountId,
              bypass_protocol_fee: bypassProtocolFee,
              custom_chef_fee_basis_points: bypassChefFee ? 0 : undefined,
            };

            return void donateNearViaPot(
              params.potAccountId,
              args,
              floatToYoctoNear(amount),
            )
              .then((result) => dispatch.donation.success(result))
              .catch((error) => dispatch.donation.failure(error));
          }
        }
      } else if ("potId" in params) {
        switch (potDistributionStrategy) {
          case DonationPotDistributionStrategy.evenly: {
            return void dispatch.donation.failure(new Error("Not implemented"));
          }

          case DonationPotDistributionStrategy.manually: {
            return void dispatch.donation.failure(new Error("Not implemented"));
          }
        }
      }
    },

    async handleOutcome(transactionHash: string) {
      const { accountId: sender_account_id } = walletApi;

      if (sender_account_id) {
        const { data } = await getTransactionStatus({
          tx_hash: transactionHash,
          sender_account_id,
        });

        const donationData = JSON.parse(
          atob(data.result.receipts_outcome[3].outcome.status.SuccessValue),
        ) as DirectDonation | PotDonation;

        return void dispatch.donation.success(donationData);
      } else {
        return void dispatch.donation.failure(
          new Error(
            "Unable to get donation transaction status without user authentication." +
              "Please login and try again.",
          ),
        );
      }
    },
  }),
});

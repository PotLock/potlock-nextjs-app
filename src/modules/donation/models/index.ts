import { createModel } from "@rematch/core";

import { walletApi } from "@/common/contracts";
import { donateNearDirectly } from "@/common/contracts/potlock/donate";
import { DirectDonation } from "@/common/contracts/potlock/interfaces/donate.interfaces";
import { floatToYoctoNear } from "@/common/lib";
import { getTransactionStatus } from "@/common/services";
import { RootModel } from "@/store/models";

import {
  DonationAllocationStrategy,
  DonationAllocationStrategyEnum,
  DonationPotDistributionStrategy,
} from "./schemas";
import {
  DonationAllocationStrategyOption,
  DonationInputs,
  DonationState,
  DonationStep,
  DonationSubmissionInputs,
} from "./types";

export * from "./schemas";
export * from "./types";

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
    hintIfDisabled: "(WIP)", // "(no pots available)",
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

    success(state, result: DirectDonation) {
      return { ...handleStep(state, "success"), successResult: result };
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
      message,
      ...props
    }: DonationSubmissionInputs & DonationInputs): Promise<void> {
      if ("accountId" in props) {
        switch (allocationStrategy) {
          case DonationAllocationStrategyEnum.direct: {
            const args = {
              recipient_id: props.accountId,
              message,
              referrer_id: referrerAccountId,
              bypass_protocol_fee: bypassProtocolFee,
            };

            return void donateNearDirectly(args, floatToYoctoNear(amount))
              .then((result) => dispatch.donation.success(result))
              .catch((error) => dispatch.donation.failure(error));
          }

          case DonationAllocationStrategyEnum.pot:
            return void dispatch.donation.failure(new Error("Not implemented"));
        }
      } else if ("potId" in props) {
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

    async handleSuccessByTxHash(transactionHash: string) {
      const { accountId: sender_account_id } = walletApi;

      if (sender_account_id) {
        const { data } = await getTransactionStatus({
          tx_hash: transactionHash,
          sender_account_id,
        });

        const donationResult = JSON.parse(
          atob(data.result.receipts_outcome[3].outcome.status.SuccessValue),
        ) as DirectDonation;

        return void dispatch.donation.success(donationResult);
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

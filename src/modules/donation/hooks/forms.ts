import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { dispatch } from "@/app/_store";
import { walletApi } from "@/common/contracts";
import useIsHuman from "@/modules/core/hooks/useIsHuman";

import {
  DonationAllocationStrategyEnum,
  DonationInputs,
  DonationPotDistributionStrategy,
  DonationSubmissionInputs,
  donationSchema,
  donationTokenSchema,
} from "../models";

export type DonationFormParams = DonationSubmissionInputs & {
  referrerAccountId?: string;
};

export const useDonationForm = ({
  referrerAccountId,
  ...params
}: DonationFormParams) => {
  const form = useForm<DonationInputs>({
    resolver: zodResolver(donationSchema),

    defaultValues: {
      allocationStrategy:
        DonationAllocationStrategyEnum[
          "accountId" in params ? "direct" : "pot"
        ],

      tokenId: donationTokenSchema.parse(undefined),
      recipientAccountId: "accountId" in params ? params.accountId : undefined,
      referrerAccountId,
      potAccountId: "potId" in params ? params.potId : undefined,

      potDistributionStrategy:
        DonationPotDistributionStrategy[
          "accountId" in params ? "manually" : "evenly"
        ],
    },
  });

  const isSenderHumanVerified = useIsHuman(walletApi.accountId ?? "unknown");

  const onSubmit: SubmitHandler<DonationInputs> = useCallback(
    (values) => dispatch.donation.submit({ ...values, ...params }),
    [params],
  );

  return {
    isSenderHumanVerified,
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};

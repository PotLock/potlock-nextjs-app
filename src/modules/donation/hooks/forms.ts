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
  tokenIdSchema,
} from "../models";

export const useDonationForm = (params: DonationSubmissionInputs) => {
  const form = useForm<DonationInputs>({
    resolver: zodResolver(donationSchema),

    defaultValues: {
      allocationStrategy: DonationAllocationStrategyEnum.direct,
      amount: 0.1,
      tokenId: tokenIdSchema.parse(undefined),
      potDistributionStrategy: DonationPotDistributionStrategy.manually,
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

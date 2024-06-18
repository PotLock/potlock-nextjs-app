import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { dispatch } from "@/app/_store";
import { walletApi } from "@/common/contracts";
import useIsHuman from "@/modules/core/hooks/useIsHuman";

import {
  DonationInputs,
  DonationSubmissionInputs,
  donationSchema,
  tokenIdSchema,
} from "../models";

export const useDonationForm = (params: DonationSubmissionInputs) => {
  const form = useForm<DonationInputs>({
    resolver: zodResolver(donationSchema),
    defaultValues: { tokenId: tokenIdSchema.parse(undefined) },
  });

  const isSenderHumanVerified = useIsHuman(walletApi.accountId ?? "unknown");

  const onSubmit: SubmitHandler<DonationInputs> = useCallback(
    (values) => dispatch.donation.submit({ ...values, ...params }),
    [params],
  );

  console.table(form.getValues());

  return {
    isSenderHumanVerified,
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};

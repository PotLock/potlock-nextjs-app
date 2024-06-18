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
} from "../models";

export const useDonationForm = (params: DonationSubmissionInputs) => {
  const form = useForm<DonationInputs>({
    resolver: zodResolver(donationSchema),
  });

  const tokenId = form.watch("tokenId");
  const isSenderHumanVerified = useIsHuman(walletApi.accountId ?? "unknown");

  console.log(tokenId);

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

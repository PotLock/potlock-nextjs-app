import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { dispatch } from "@/app/_store";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import useIsHuman from "@/modules/core/hooks/useIsHuman";

import { DonationInputs, donationSchema } from "../models";

export type DonationFormParameters = {};

export const useDonationForm = (_: DonationFormParameters) => {
  const { handleSubmit, watch, ...form } = useForm<DonationInputs>({
    resolver: zodResolver(donationSchema),
  });

  const values = watch();
  const isFtDonation = values.tokenId !== NEAR_TOKEN_DENOM;
  const isSenderHumanVerified = useIsHuman(values.recipientAccountId);

  const onSubmit: SubmitHandler<DonationInputs> = useCallback(
    (data) => dispatch.donation.submit(data),
    [],
  );

  console.table(form.getValues());

  return {
    isFtDonation,
    isSenderHumanVerified,
    onSubmit: handleSubmit(onSubmit),
    values,
    ...form,
  };
};

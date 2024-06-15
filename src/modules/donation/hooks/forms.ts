import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { NEAR_TOKEN_DENOM } from "@/common/constants";
import useIsHuman from "@/modules/core/hooks/useIsHuman";

import { DonationInputs, donationSchema } from "../models";

export type DonationFormParameters = {};

export const useDonationForm = (_: DonationFormParameters) => {
  const { handleSubmit, watch, ...form } = useForm<DonationInputs>({
    resolver: zodResolver(donationSchema),
  });

  const isFtDonation = watch("tokenId") !== NEAR_TOKEN_DENOM;
  const isSenderHumanVerified = useIsHuman(watch("recipientAccountId"));

  const onSubmit: SubmitHandler<DonationInputs> = useCallback((data) => {
    console.table(data);
  }, []);

  return {
    isFtDonation,
    isSenderHumanVerified,
    onSubmit: handleSubmit(onSubmit),
    ...form,
  };
};

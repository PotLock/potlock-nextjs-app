import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { DonationInputs, donationSchema } from "../models";

export type DonationFormParameters = {};

export const useDonationForm = (_: DonationFormParameters) => {
  const { handleSubmit, ...form } = useForm<DonationInputs>({
    resolver: zodResolver(donationSchema),
  });

  const onSubmit: SubmitHandler<DonationInputs> = useCallback((data) => {
    console.table(data);
  }, []);

  return { onSubmit: handleSubmit(onSubmit), ...form };
};

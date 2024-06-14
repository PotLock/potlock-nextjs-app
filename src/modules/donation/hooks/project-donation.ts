import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { infer as FromSchema } from "zod";

import { donationSchema } from "@/common/api/potlock";

export const projectDonationSchema = donationSchema;

export type ProjectDonationInputs = FromSchema<typeof projectDonationSchema>;

export type ProjectDonationFormParameters = {};

export const useProjectDonationForm = (_: ProjectDonationFormParameters) => {
  const { handleSubmit, ...form } = useForm<ProjectDonationInputs>({
    resolver: zodResolver(donationSchema),
  });

  const onSubmit: SubmitHandler<ProjectDonationInputs> = useCallback((data) => {
    console.log(data);
  }, []);

  return { onSubmit: handleSubmit(onSubmit), ...form };
};

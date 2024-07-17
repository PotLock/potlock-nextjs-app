import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { dispatch } from "@/app/_store";
import useWallet from "@/modules/auth/hooks/useWallet";

import { addFundingSourceSchema, createProjectSchema } from "../models/schemas";
import { AddFundingSourceInputs, CreateProjectInputs } from "../models/types";
import handleCreateOrUpdateProject from "../utils/handleCreateOrUpdateProject";

export const useCreateProjectForm = () => {
  const form = useForm<CreateProjectInputs>({
    resolver: zodResolver(createProjectSchema),
    mode: "onChange",
  });
  const { wallet } = useWallet();

  const onSubmit: SubmitHandler<CreateProjectInputs> = useCallback(
    async (_) => {
      // not using form data, using store data provided by form
      if (wallet) {
        dispatch.createProject.submissionStatus("sending");

        handleCreateOrUpdateProject().then(async (result) => {
          // TODO: Verification should be made using the verification as this is going to open the wallet for approval
          // dispatch.createProject.submissionStatus(
          //   result.success ? "done" : "pending",
          // );
          // dispatch.createProject.setSubmissionError(result.error || "");
          if (result.success) {
            console.log("Opening wallet for approval...");
          } else {
            dispatch.createProject.submissionStatus("pending");
          }
        });
      }
    },
    [wallet],
  );

  return {
    form,
    errors: form.formState.errors,
    onSubmit: form.handleSubmit(onSubmit),
  };
};

export const useAddFundingSourceForm = () => {
  const form = useForm<AddFundingSourceInputs>({
    resolver: zodResolver(addFundingSourceSchema),
  });

  return {
    form,
    errors: form.formState.errors,
  };
};

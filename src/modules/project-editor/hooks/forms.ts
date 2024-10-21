import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import useWallet from "@/modules/auth/hooks/useWallet";
import { dispatch } from "@/store";

import { addFundingSourceSchema, projectEditorSchema } from "../models/schemas";
import { AddFundingSourceInputs, CreateProjectInputs } from "../models/types";
import handleCreateOrUpdateProject from "../utils/handleCreateOrUpdateProject";

export const useCreateProjectForm = () => {
  const form = useForm<CreateProjectInputs>({
    resolver: zodResolver(projectEditorSchema),
    mode: "onChange",
  });
  const { wallet } = useWallet();

  const onSubmit: SubmitHandler<CreateProjectInputs> = useCallback(
    async (_) => {
      // not using form data, using store data provided by form
      if (wallet) {
        dispatch.projectEditor.submissionStatus("sending");

        handleCreateOrUpdateProject().then(async (result) => {
          if (result.success) {
            console.log("Opening wallet for approval...");
          } else {
            dispatch.projectEditor.submissionStatus("pending");
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

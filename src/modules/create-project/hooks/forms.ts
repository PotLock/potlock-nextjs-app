import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { addFundingSourceSchema, createProjectSchema } from "../models/schemas";
import { AddFundingSourceInputs, CreateProjectInputs } from "../models/types";

export const useCreateProjectForm = () => {
  const form = useForm<CreateProjectInputs>({
    resolver: zodResolver(createProjectSchema),
    mode: "onChange",
  });

  const createProjectHandler = useCallback((data: CreateProjectInputs) => {
    console.log(data);
  }, []);

  const onSubmit: SubmitHandler<CreateProjectInputs> = useCallback(
    (data) => {
      console.log("DATA:", data);
      createProjectHandler(data);
    },
    [createProjectHandler],
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

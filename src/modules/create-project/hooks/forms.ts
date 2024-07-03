import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { createProjectSchema } from "../models/schemas";
import { CreateProjectInputs } from "../models/types";

export const useCreateProjectForm = () => {
  const form = useForm<CreateProjectInputs>({
    resolver: zodResolver(createProjectSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<CreateProjectInputs> = useCallback((data) => {
    console.log(data);
  }, []);

  return {
    form,
    errors: form.formState.errors,
    onSubmit: form.handleSubmit(onSubmit),
  };
};

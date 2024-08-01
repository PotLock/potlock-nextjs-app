import { useCallback, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";

import { walletApi } from "@/common/contracts";
import { dispatch } from "@/store";

import { PotDeploymentInputs, potDeploymentSchema } from "../models";

export const usePotDeploymentForm = () => {
  const router = useRouter();

  const defaultValues = useMemo<Partial<PotDeploymentInputs>>(
    () => ({
      owner: walletApi.accountId,
    }),

    [],
  );

  const form = useForm<PotDeploymentInputs>({
    resolver: zodResolver(potDeploymentSchema),
    mode: "onChange",
    defaultValues,
    resetOptions: { keepDirtyValues: true },
  });

  const isDisabled =
    !form.formState.isDirty ||
    !form.formState.isValid ||
    form.formState.isSubmitting;

  const onCancel = () => {
    form.reset();
    router.back();
  };

  const onSubmit: SubmitHandler<PotDeploymentInputs> = useCallback(
    (values) => dispatch.pot.deploy({ ...values }),
    [],
  );

  return { form, isDisabled, onCancel, onSubmit: form.handleSubmit(onSubmit) };
};

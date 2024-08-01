import { useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { walletApi } from "@/common/contracts";

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

  return { form, isDisabled, onCancel };
};

import { useCallback, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import { walletApi } from "@/common/contracts";
import { AccountId } from "@/common/types";
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

  const currentValues = useWatch({ control: form.control });

  const isDisabled =
    !form.formState.isDirty ||
    !form.formState.isValid ||
    form.formState.isSubmitting;

  const handleAdminAdd = (accountId: AccountId) => {
    form.setValue("admins", [...(currentValues.admins ?? []), accountId]);
  };

  const handleAdminRemove = (accountId: AccountId) => {
    form.setValue(
      "admins",
      (currentValues.admins ?? []).filter(
        (adminAccountId) => accountId !== adminAccountId,
      ),
    );
  };

  const onCancel = () => {
    form.reset();
    router.back();
  };

  const onSubmit: SubmitHandler<PotDeploymentInputs> = useCallback(
    (values) => dispatch.pot.deploy({ ...values }),
    [],
  );

  return {
    form,
    handleAdminAdd,
    handleAdminRemove,
    isDisabled,
    onCancel,
    onSubmit: form.handleSubmit(onSubmit),
  };
};

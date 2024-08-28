import { useCallback, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";

import { walletApi } from "@/common/api/near";
import {
  POTLOCK_CONTRACT_REPO_URL,
  POTLOCK_CONTRACT_VERSION,
} from "@/common/constants";
import { AccountId } from "@/common/types";
import { useCoreState } from "@/modules/core";
import { donationFeeBasisPointsToPercents } from "@/modules/donation";
import { dispatch } from "@/store";

import {
  PotDeploymentInputs,
  potCrossFieldValidationTargets,
  potDeploymentSchema,
} from "../models";

export const usePotDeploymentForm = () => {
  const router = useRouter();

  const {
    contractMetadata: { latestSourceCodeCommitHash },
  } = useCoreState();

  const defaultValues = useMemo<Partial<PotDeploymentInputs>>(
    () => ({
      source_metadata: {
        version: POTLOCK_CONTRACT_VERSION,
        commit_hash: latestSourceCodeCommitHash,
        link: POTLOCK_CONTRACT_REPO_URL,
      },

      owner: walletApi.accountId,
      max_projects: 25,

      referral_fee_matching_pool_basis_points:
        donationFeeBasisPointsToPercents(100),

      referral_fee_public_round_basis_points:
        donationFeeBasisPointsToPercents(100),

      chef_fee_basis_points: donationFeeBasisPointsToPercents(100),
      isPgRegistrationRequired: true,
      isNadabotVerificationRequired: false,
    }),

    [latestSourceCodeCommitHash],
  );

  const form = useForm<PotDeploymentInputs>({
    resolver: zodResolver(potDeploymentSchema),
    mode: "onChange",
    defaultValues,
    resetOptions: { keepDirtyValues: true },
  });

  const formValues = useWatch({ control: form.control });

  const crossFieldErrors = useMemo<FieldErrors<PotDeploymentInputs>>(
    () =>
      potDeploymentSchema
        .safeParse(formValues as PotDeploymentInputs)
        .error?.issues.reduce((schemaErrors, { code, message, path }) => {
          const fieldPath = path.at(0);

          return potCrossFieldValidationTargets.includes(
            fieldPath as keyof PotDeploymentInputs,
          ) &&
            typeof fieldPath === "string" &&
            code === "custom"
            ? { ...schemaErrors, [fieldPath]: { message, type: code } }
            : schemaErrors;
        }, {}) ?? {},

    [formValues],
  );

  const refinedForm = {
    ...form,

    formState: {
      ...form.formState,
      errors: { ...form.formState.errors, ...crossFieldErrors },
    },
  };

  const isDisabled =
    formValues.source_metadata === null ||
    !form.formState.isDirty ||
    !form.formState.isValid ||
    form.formState.isSubmitting;

  const handleAdminsUpdate = useCallback(
    (accountIds: AccountId[]) => form.setValue("admins", accountIds),
    [form],
  );

  const onCancel = () => {
    form.reset();
    router.back();
  };

  const onSubmit: SubmitHandler<PotDeploymentInputs> = useCallback(
    (inputs) => dispatch.pot.deploy(inputs),
    [],
  );

  return {
    form: refinedForm,
    formValues,
    handleAdminsUpdate,
    isDisabled,
    onCancel,
    onSubmit: form.handleSubmit(onSubmit),
  };
};

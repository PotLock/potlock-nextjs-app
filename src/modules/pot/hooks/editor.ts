import { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { ZodError } from "zod";

import { walletApi } from "@/common/api/near";
import { ByPotId } from "@/common/api/potlock";
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

export type PotEditorFormArgs = Partial<ByPotId>;

export const usePotEditorForm = ({ potId }: PotEditorFormArgs) => {
  const isNewPot = typeof potId !== "string";
  const router = useRouter();

  console.log(potId);

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
      isNadabotVerificationRequired: true,
    }),

    [latestSourceCodeCommitHash],
  );

  const self = useForm<PotDeploymentInputs>({
    resolver: zodResolver(potDeploymentSchema),
    mode: "onChange",
    defaultValues,
    resetOptions: { keepDirtyValues: true },
  });

  const values = useWatch(self);

  const [crossFieldErrors, setCrossFieldErrors] = useState<
    FieldErrors<PotDeploymentInputs>
  >({});

  useEffect(
    () =>
      void potDeploymentSchema
        .parseAsync(values as PotDeploymentInputs)
        .then(() => setCrossFieldErrors({}))
        .catch((error: ZodError) =>
          setCrossFieldErrors(
            error?.issues.reduce((schemaErrors, { code, message, path }) => {
              const fieldPath = path.at(0);

              return potCrossFieldValidationTargets.includes(
                fieldPath as keyof PotDeploymentInputs,
              ) &&
                typeof fieldPath === "string" &&
                code === "custom"
                ? { ...schemaErrors, [fieldPath]: { message, type: code } }
                : schemaErrors;
            }, {}),
          ),
        ),

    [values],
  );

  const isDisabled =
    values.source_metadata === null ||
    !self.formState.isDirty ||
    !self.formState.isValid ||
    self.formState.isSubmitting;

  const handleAdminsUpdate = useCallback(
    (accountIds: AccountId[]) => self.setValue("admins", accountIds),
    [self],
  );

  const onCancel = useCallback(() => {
    self.reset();

    if (isNewPot) {
      router.back();
    }
  }, [self, isNewPot, router]);

  const onSubmit: SubmitHandler<PotDeploymentInputs> = useCallback(
    (inputs) => dispatch.pot.deploy(inputs),
    [],
  );

  return {
    form: {
      ...self,

      formState: {
        ...self.formState,
        errors: { ...self.formState.errors, ...crossFieldErrors },
      },
    },

    values,
    handleAdminsUpdate,
    isDisabled,
    isNewPot,
    onCancel,
    onSubmit: self.handleSubmit(onSubmit),
  };
};

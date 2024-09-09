import { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { ZodError } from "zod";

import { walletApi } from "@/common/api/near";
import { ByPotId, potlock } from "@/common/api/potlock";
import {
  POTLOCK_CONTRACT_REPO_URL,
  POTLOCK_CONTRACT_VERSION,
} from "@/common/constants";
import { useCoreState } from "@/modules/core";
import { donationFeeBasisPointsToPercents } from "@/modules/donation";
import {
  PotInputs,
  potCrossFieldValidationTargets,
  potSchema,
} from "@/modules/pot";
import { dispatch } from "@/store";

import { potIndexedDataToPotInputs } from "../utils/normalization";

export type PotEditorFormArgs = Partial<ByPotId>;

export const usePotEditorForm = ({ potId }: PotEditorFormArgs) => {
  const isNewPot = typeof potId !== "string";

  const {
    contractMetadata: { latestSourceCodeCommitHash },
  } = useCoreState();

  const { data: existingPotData } = potlock.usePot({ potId });

  const existingValues = useMemo<Partial<PotInputs>>(
    () =>
      existingPotData === undefined
        ? {}
        : potIndexedDataToPotInputs(existingPotData),

    [existingPotData],
  );

  const defaultValues = useMemo<Partial<PotInputs>>(
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
      isSybilResistanceEnabled: true,
      ...existingValues,
    }),

    [existingValues, latestSourceCodeCommitHash],
  );

  const self = useForm<PotInputs>({
    resolver: zodResolver(potSchema),
    mode: "onChange",
    defaultValues,
    resetOptions: { keepDirtyValues: true },
  });

  const values = useWatch(self);

  const [crossFieldErrors, setCrossFieldErrors] = useState<
    FieldErrors<PotInputs>
  >({});

  useEffect(
    () =>
      void potSchema
        .parseAsync(values as PotInputs)
        .then(() => setCrossFieldErrors({}))
        .catch((error: ZodError) =>
          setCrossFieldErrors(
            error?.issues.reduce((schemaErrors, { code, message, path }) => {
              const fieldPath = path.at(0);

              return potCrossFieldValidationTargets.includes(
                fieldPath as keyof PotInputs,
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

  const onSubmit: SubmitHandler<PotInputs> = useCallback(
    (inputs) => {
      if (isNewPot) {
        dispatch.potEditor.save(inputs);
      }
    },
    [isNewPot],
  );

  return {
    form: {
      ...self,

      formState: {
        ...self.formState,
        errors: { ...self.formState.errors, ...crossFieldErrors },
      },
    },

    isDisabled,
    isNewPot,
    onSubmit: self.handleSubmit(onSubmit),
    values,
  };
};

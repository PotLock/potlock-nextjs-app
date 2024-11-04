import { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { infer as FromSchema, ZodError } from "zod";

import {
  CONTRACT_SOURCECODE_REPO_URL,
  CONTRACT_SOURCECODE_VERSION,
} from "@/common/_config";
import { ByPotId, indexer } from "@/common/api/indexer";
import { walletApi } from "@/common/api/near";
import { PotConfig } from "@/common/contracts/potlock";
import { AccountId } from "@/common/types";
import { useCoreState } from "@/modules/core";
import { donationFeeBasisPointsToPercents } from "@/modules/donation";
import { PotInputs } from "@/modules/pot";
import { dispatch } from "@/store";

import {
  PotEditorDeploymentInputs,
  PotEditorDeploymentSchema,
  PotEditorSettings,
  PotEditorSettingsSchema,
  potEditorDeploymentCrossFieldValidationTargets,
  potEditorSettingsCrossFieldValidationTargets,
} from "../models";
import {
  potConfigToSettings,
  potIndexedDataToPotInputs,
} from "../utils/normalization";

export type PotEditorFormArgs =
  | (ByPotId & {
      schema: PotEditorDeploymentSchema;
    })
  | { schema: PotEditorSettingsSchema };

export const usePotEditorForm = ({ schema, ...props }: PotEditorFormArgs) => {
  const potId = "potId" in props ? props.potId : undefined;
  const isNewPot = "potId" in props && typeof potId !== "string";

  const { data: potIndexedData } = indexer.usePot({ potId });

  type Values = FromSchema<typeof schema>;

  const {
    contractMetadata: { latestSourceCodeCommitHash },
  } = useCoreState();

  const existingValues = useMemo<Partial<Values>>(
    () =>
      potIndexedData === undefined
        ? {}
        : potIndexedDataToPotInputs(potIndexedData),

    [potIndexedData],
  );

  const defaultValues = useMemo<Partial<Values>>(
    () => ({
      source_metadata: {
        version: CONTRACT_SOURCECODE_VERSION,
        commit_hash: latestSourceCodeCommitHash,
        link: CONTRACT_SOURCECODE_REPO_URL,
      },

      owner: walletApi.accountId,
      max_projects: 25,
      min_matching_pool_donation_amount: 0.1,

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

  const self = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues,
    resetOptions: { keepDirtyValues: false },
  });

  const values = useWatch(self);

  const handleAdminsUpdate = useCallback(
    (accountIds: AccountId[]) =>
      self.setValue("admins", accountIds, { shouldDirty: true }),
    [self],
  );

  const [crossFieldErrors, setCrossFieldErrors] = useState<FieldErrors<Values>>(
    {},
  );

  useEffect(
    () =>
      void schema
        .parseAsync(values as Values)
        .then(() => setCrossFieldErrors({}))
        .catch((error: ZodError) =>
          setCrossFieldErrors(
            error?.issues.reduce((schemaErrors, { code, message, path }) => {
              const fieldPath = path.at(0);

              return (isNewPot
                ? potEditorDeploymentCrossFieldValidationTargets
                : potEditorSettingsCrossFieldValidationTargets
              ).includes(fieldPath as keyof PotInputs) &&
                typeof fieldPath === "string" &&
                code === "custom"
                ? { ...schemaErrors, [fieldPath]: { message, type: code } }
                : schemaErrors;
            }, {}),
          ),
        ),

    [isNewPot, schema, values],
  );

  const isDisabled = useMemo(
    () =>
      values.source_metadata === null ||
      !self.formState.isDirty ||
      !self.formState.isValid ||
      self.formState.isSubmitting,

    [
      self.formState.isDirty,
      self.formState.isSubmitting,
      self.formState.isValid,
      values.source_metadata,
    ],
  );

  const onSubmit: SubmitHandler<Values> = useCallback(
    (values) =>
      dispatch.potEditor.save({
        onUpdate: (config: PotConfig) =>
          self.reset(potConfigToSettings(config)),

        ...(isNewPot
          ? (values as PotEditorDeploymentInputs)
          : { potId, ...(values as PotEditorSettings) }),
      }),

    [isNewPot, potId, self],
  );

  return {
    form: {
      ...self,

      formState: {
        ...self.formState,
        errors: { ...self.formState.errors, ...crossFieldErrors },
      },
    },

    handleAdminsUpdate,
    isDisabled,
    isNewPot,
    onSubmit: self.handleSubmit(onSubmit),
    values,
  };
};

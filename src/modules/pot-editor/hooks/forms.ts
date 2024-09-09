import { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { pick } from "remeda";
import { infer as FromSchema, ZodError } from "zod";

import { walletApi } from "@/common/api/near";
import { ByPotId, potlock } from "@/common/api/potlock";
import {
  POTLOCK_CONTRACT_REPO_URL,
  POTLOCK_CONTRACT_VERSION,
} from "@/common/constants";
import { AccountId } from "@/common/types";
import { useCoreState } from "@/modules/core";
import { donationFeeBasisPointsToPercents } from "@/modules/donation";
import { PotInputs } from "@/modules/pot";
import { dispatch } from "@/store";

import {
  PotEditorDeploymentInputs,
  PotEditorSettings,
  potEditorDeploymentCrossFieldValidationTargets,
  potEditorDeploymentSchema,
  potEditorSettingsCrossFieldValidationTargets,
  potEditorSettingsSchema,
} from "../models";
import { potIndexedDataToPotInputs } from "../utils/normalization";

export type PotEditorFormArgs =
  | (ByPotId & {
      schema: typeof potEditorSettingsSchema;
    })
  | { schema: typeof potEditorDeploymentSchema };

export const usePotEditorForm = ({ schema, ...props }: PotEditorFormArgs) => {
  const potId = "potId" in props ? props.potId : undefined;
  const isNewPot = "potId" in props && typeof potId !== "string";

  type Values = FromSchema<typeof schema>;

  const {
    contractMetadata: { latestSourceCodeCommitHash },
  } = useCoreState();

  const { data: existingPotData } = potlock.usePot({ potId });

  const existingValues = useMemo<Partial<Values>>(
    () =>
      existingPotData === undefined
        ? {}
        : potIndexedDataToPotInputs(existingPotData),

    [existingPotData],
  );

  const defaultValues = useMemo<Partial<Values>>(
    () => ({
      source_metadata: {
        version: POTLOCK_CONTRACT_VERSION,
        commit_hash: latestSourceCodeCommitHash,
        link: POTLOCK_CONTRACT_REPO_URL,
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
    mode: "onChange",
    defaultValues,
    resetOptions: { keepDirtyValues: true },
  });

  const values = useWatch(self);

  const handleAdminsUpdate = useCallback(
    (accountIds: AccountId[]) => self.setValue("admins", accountIds),
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
    (inputs) =>
      dispatch.potEditor.save(
        isNewPot
          ? (inputs as PotEditorDeploymentInputs)
          : (inputs as PotEditorSettings),
      ),
    [isNewPot],
  );

  useEffect(() => {
    console.table(pick(self.formState, ["isValid"]));
    console.log("common", self.formState.errors);
    console.log("crossfield", crossFieldErrors);

    console.log(values);

    Object.values({ ...self.formState.errors, ...crossFieldErrors }).forEach(
      ({ message }) => console.error(message),
    );
  }, [
    crossFieldErrors,
    self.formState,
    self.formState.errors,
    self.formState.isValid,
    values,
  ]);

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

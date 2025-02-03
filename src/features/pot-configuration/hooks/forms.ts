import { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { isDeepEqual, keys, pick } from "remeda";
import { Temporal } from "temporal-polyfill";
import { infer as FromSchema, ZodError } from "zod";

import { CONTRACT_SOURCECODE_REPO_URL, CONTRACT_SOURCECODE_VERSION } from "@/common/_config";
import { ByPotId, type PotId } from "@/common/api/indexer";
import { PotConfig, potContractHooks } from "@/common/contracts/core/pot";
import { daysFloatToMilliseconds } from "@/common/lib";
import { AccountId } from "@/common/types";
import { useWalletUserSession } from "@/common/wallet";
import { PotInputs } from "@/entities/pot";
import { donationFeeBasisPointsToPercents } from "@/features/donation";
import { rootPathnames } from "@/pathnames";
import { dispatch, useCoreState } from "@/store";

import {
  PotDeploymentInputs,
  PotDeploymentSchema,
  PotSettings,
  PotSettingsSchema,
  potDeploymentCrossFieldValidationTargets,
  potSettingsCrossFieldValidationTargets,
} from "../model";
import { potConfigToPotConfigInputs, potConfigToSettings } from "../utils/normalization";

export type PotConfigurationEditorFormArgs =
  | (ByPotId & { schema: PotDeploymentSchema })
  | { schema: PotSettingsSchema };

export const usePotConfigurationEditorForm = ({
  schema,
  ...props
}: PotConfigurationEditorFormArgs) => {
  const viewer = useWalletUserSession();
  const router = useRouter();
  const potId = "potId" in props ? props.potId : undefined;
  const isNewPot = potId === undefined;

  const { isLoading: isPotConfigLoading, data: potConfig } = potContractHooks.useConfig({
    enabled: potId !== undefined,
    potId: potId as PotId,
  });

  type Values = FromSchema<typeof schema>;

  const {
    contractMetadata: { latestSourceCodeCommitHash },
  } = useCoreState();

  const defaultValues = useMemo<Partial<Values>>(
    () => ({
      source_metadata: {
        version: CONTRACT_SOURCECODE_VERSION,
        commit_hash: latestSourceCodeCommitHash,
        link: CONTRACT_SOURCECODE_REPO_URL,
      },

      owner: viewer.accountId,
      max_projects: 25,
      referral_fee_matching_pool_basis_points: donationFeeBasisPointsToPercents(100),
      referral_fee_public_round_basis_points: donationFeeBasisPointsToPercents(100),

      application_start_ms: Temporal.Now.instant().epochMilliseconds + daysFloatToMilliseconds(1),
      application_end_ms: Temporal.Now.instant().epochMilliseconds + daysFloatToMilliseconds(15),

      public_round_start_ms:
        Temporal.Now.instant().epochMilliseconds + daysFloatToMilliseconds(16) + 60000,

      public_round_end_ms:
        Temporal.Now.instant().epochMilliseconds + daysFloatToMilliseconds(29) + 60000,

      chef_fee_basis_points: donationFeeBasisPointsToPercents(100),
      isPgRegistrationRequired: true,
      isSybilResistanceEnabled: true,
      ...(potConfig === undefined ? {} : potConfigToPotConfigInputs(potConfig)),
    }),

    [latestSourceCodeCommitHash, potConfig, viewer.accountId],
  );

  const self = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues,
    resetOptions: { keepDirtyValues: false },
  });

  const values = useWatch(self);

  const isHydrating = useMemo(() => isPotConfigLoading, [isPotConfigLoading]);

  const isUnpopulated =
    !isDeepEqual(defaultValues, pick(self.formState.defaultValues ?? {}, keys(defaultValues))) &&
    !self.formState.isDirty;

  useEffect(() => {
    if (isNewPot && values.owner === undefined && viewer.hasWalletReady && viewer.isSignedIn) {
      self.setValue("owner", viewer.accountId, { shouldValidate: true });
      console.log("test??");
    }

    if (!isNewPot && potConfig !== undefined && isUnpopulated && !isHydrating) {
      self.reset(defaultValues, { keepDirty: false, keepIsValid: false });
    }
  }, [
    defaultValues,
    isHydrating,
    isNewPot,
    isUnpopulated,
    potConfig,
    self,
    values,
    viewer,
    viewer.accountId,
    viewer.hasWalletReady,
    viewer.isSignedIn,
  ]);

  const handleAdminsUpdate = useCallback(
    (accountIds: AccountId[]) => self.setValue("admins", accountIds, { shouldDirty: true }),
    [self],
  );

  const [crossFieldErrors, setCrossFieldErrors] = useState<FieldErrors<Values>>({});

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
                ? potDeploymentCrossFieldValidationTargets
                : potSettingsCrossFieldValidationTargets
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
      self.formState.isSubmitting ||
      isHydrating,

    [
      isHydrating,
      self.formState.isDirty,
      self.formState.isSubmitting,
      self.formState.isValid,
      values.source_metadata,
    ],
  );

  const onSubmit: SubmitHandler<Values> = useCallback(
    (values) => {
      self.trigger();

      dispatch.potConfiguration.save({
        onDeploymentSuccess: ({ potId }: ByPotId) => router.push(`${rootPathnames.pot}/${potId}`),
        onUpdate: (config: PotConfig) => self.reset(potConfigToSettings(config)),
        ...(isNewPot ? (values as PotDeploymentInputs) : { potId, ...(values as PotSettings) }),
      });
    },

    [isNewPot, potId, router, self],
  );

  const formWithCrossFieldErrors = useMemo(
    () => ({
      ...self,

      formState: {
        ...self.formState,
        errors: { ...self.formState.errors, ...crossFieldErrors },
      },
    }),

    [crossFieldErrors, self],
  );

  return {
    form: formWithCrossFieldErrors,
    handleAdminsUpdate,
    isDisabled,
    isHydrating,
    isNewPot,
    onSubmit: self.handleSubmit(onSubmit),
    values,
  };
};

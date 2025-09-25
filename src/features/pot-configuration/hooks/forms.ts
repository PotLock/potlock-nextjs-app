import { useCallback, useEffect, useMemo } from "react";

import { useRouter } from "next/router";
import { SubmitHandler, useWatch } from "react-hook-form";
import { useDispatch } from "react-redux";
import { prop } from "remeda";
import { Temporal } from "temporal-polyfill";
import { infer as FromSchema } from "zod";

import { CONTRACT_SOURCECODE_REPO_URL, CONTRACT_SOURCECODE_VERSION } from "@/common/_config";
import { ByPotId, type PotId } from "@/common/api/indexer";
import { PotConfig, potContractHooks } from "@/common/contracts/core/pot";
import { feeBasisPointsToPercents } from "@/common/contracts/core/utils";
import { daysFloatToMilliseconds } from "@/common/lib";
import { AccountId } from "@/common/types";
import { useEnhancedForm } from "@/common/ui/form/hooks";
import { useWalletUserSession } from "@/common/wallet";
import { rootPathnames } from "@/pathnames";
import { type AppDispatcher } from "@/store";
import { useGlobalStoreSelector } from "@/store/hooks";

import {
  PotDeploymentInputs,
  PotDeploymentSchema,
  PotSettings,
  PotSettingsSchema,
  potDeploymentDependentFields,
  potSettingsDependentFields,
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
  const dispatch = useDispatch<AppDispatcher>();
  const router = useRouter();
  const potId = "potId" in props ? props.potId : undefined;
  const isNewPot = potId === undefined;

  const { isLoading: isPotConfigLoading, data: potConfig } = potContractHooks.useConfig({
    enabled: potId !== undefined,
    potId: potId as PotId,
  });

  const {
    contractMetadata: { latestSourceCodeCommitHash },
  } = useGlobalStoreSelector(prop("core"));

  const isHydrating = useMemo(() => isPotConfigLoading, [isPotConfigLoading]);

  type Values = FromSchema<typeof schema>;

  const defaultValues = useMemo<Partial<Values>>(
    () => ({
      source_metadata: {
        version: CONTRACT_SOURCECODE_VERSION,
        commit_hash: latestSourceCodeCommitHash,
        link: CONTRACT_SOURCECODE_REPO_URL,
      },

      owner: viewer.accountId,
      max_projects: 25,
      referral_fee_matching_pool_basis_points: feeBasisPointsToPercents(100),
      referral_fee_public_round_basis_points: feeBasisPointsToPercents(100),

      application_start_ms: Temporal.Now.instant().epochMilliseconds + daysFloatToMilliseconds(1),
      application_end_ms: Temporal.Now.instant().epochMilliseconds + daysFloatToMilliseconds(15),

      public_round_start_ms:
        Temporal.Now.instant().epochMilliseconds + daysFloatToMilliseconds(16) + 60000,

      public_round_end_ms:
        Temporal.Now.instant().epochMilliseconds + daysFloatToMilliseconds(29) + 60000,

      chef_fee_basis_points: feeBasisPointsToPercents(100),
      isPgRegistrationRequired: true,
      isSybilResistanceEnabled: true,
      ...(potConfig === undefined ? {} : potConfigToPotConfigInputs(potConfig)),
    }),

    [latestSourceCodeCommitHash, potConfig, viewer.accountId],
  );

  const { form: self } = useEnhancedForm({
    schema,
    dependentFields: isNewPot ? potDeploymentDependentFields : potSettingsDependentFields,
    mode: "all",
    defaultValues,
    followDefaultValues: !isNewPot && potConfig !== undefined && !isHydrating,
    resetOptions: { keepDirtyValues: false },
  });

  const values = useWatch(self);

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

  const handleAdminsUpdate = useCallback(
    (accountIds: AccountId[]) => self.setValue("admins", accountIds, { shouldDirty: true }),
    [self],
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

    [dispatch.potConfiguration, isNewPot, potId, router, self],
  );

  useEffect(() => {
    if (isNewPot && values.owner === undefined && viewer.hasWalletReady && viewer.isSignedIn) {
      self.setValue("owner", viewer.accountId, { shouldValidate: true });
    }
  }, [isNewPot, self, values.owner, viewer.accountId, viewer.hasWalletReady, viewer.isSignedIn]);

  return {
    form: self,
    handleAdminsUpdate,
    isDisabled,
    isHydrating,
    isNewPot,
    onSubmit: self.handleSubmit(onSubmit),
    values,
  };
};

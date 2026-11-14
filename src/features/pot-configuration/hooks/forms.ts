import { useCallback, useEffect, useMemo } from "react";

import { useRouter } from "next/router";
import { SubmitHandler, useWatch } from "react-hook-form";
import { useDispatch } from "react-redux";
import { prop } from "remeda";
import { Temporal } from "temporal-polyfill";
import { infer as FromSchema } from "zod";

import { CONTRACT_SOURCECODE_REPO_URL, CONTRACT_SOURCECODE_VERSION } from "@/common/_config";
import { ByPotId, type PotId, indexer } from "@/common/api/indexer";
import { PotConfig, potContractHooks } from "@/common/contracts/core/pot";
import { feeBasisPointsToPercents } from "@/common/contracts/core/utils";
import { daysFloatToMilliseconds } from "@/common/lib";
import { AccountId } from "@/common/types";
import { useEnhancedForm } from "@/common/ui/form/hooks";
import { useWalletUserSession } from "@/common/wallet";
import { rootPathnames } from "@/navigation";
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
import { filterPastDatesForSubmit, potConfigToSettings } from "../utils/normalization";

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

  // Fetch pot data from indexer to get source_metadata for updates
  const { data: pot } = indexer.usePot({
    enabled: potId !== undefined,
    potId: potId as PotId,
  });

  const {
    contractMetadata: { latestSourceCodeCommitHash },
  } = useGlobalStoreSelector(prop("core"));

  const isHydrating = useMemo(() => isPotConfigLoading, [isPotConfigLoading]);

  type Values = FromSchema<typeof schema>;

  const defaultValues = useMemo<Partial<Values>>(() => {
    // Base defaults for non-date fields
    const nonDateDefaults = {
      max_projects: 25,
      referral_fee_matching_pool_basis_points: feeBasisPointsToPercents(100),
      referral_fee_public_round_basis_points: feeBasisPointsToPercents(100),
      chef_fee_basis_points: feeBasisPointsToPercents(100),
      isPgRegistrationRequired: true,
      isSybilResistanceEnabled: true,
    };

    // For new pots, include default dates (in the future)
    if (isNewPot) {
      return {
        ...nonDateDefaults,
        application_start_ms: Temporal.Now.instant().epochMilliseconds + daysFloatToMilliseconds(1),
        application_end_ms: Temporal.Now.instant().epochMilliseconds + daysFloatToMilliseconds(15),
        public_round_start_ms:
          Temporal.Now.instant().epochMilliseconds + daysFloatToMilliseconds(16) + 60000,
        public_round_end_ms:
          Temporal.Now.instant().epochMilliseconds + daysFloatToMilliseconds(29) + 60000,
        source_metadata: {
          version: CONTRACT_SOURCECODE_VERSION,
          commit_hash: latestSourceCodeCommitHash,
          link: CONTRACT_SOURCECODE_REPO_URL,
        },
        owner: viewer.accountId,
      };
    }

    // For updates, use values from potConfig (includes all dates for display)
    const potConfigInputs = potConfig === undefined ? {} : potConfigToSettings(potConfig);

    // Get source_metadata from pot indexer data (includes the stored commit_hash)
    const storedSourceMetadata = pot?.source_metadata as
      | { version: string; commit_hash: string | null; link: string }
      | undefined;

    // For updates, include all dates from potConfig for display
    // Past dates will be filtered out when submitting
    return {
      ...nonDateDefaults,
      ...potConfigInputs,
      // Use stored source_metadata if available, otherwise fall back to latest
      source_metadata: storedSourceMetadata
        ? {
            version: storedSourceMetadata.version ?? CONTRACT_SOURCECODE_VERSION,
            commit_hash: storedSourceMetadata.commit_hash ?? latestSourceCodeCommitHash,
            link: storedSourceMetadata.link ?? CONTRACT_SOURCECODE_REPO_URL,
          }
        : {
            version: CONTRACT_SOURCECODE_VERSION,
            commit_hash: latestSourceCodeCommitHash,
            link: CONTRACT_SOURCECODE_REPO_URL,
          },
    };
  }, [latestSourceCodeCommitHash, potConfig, pot, viewer.accountId, isNewPot]);

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
      self.formState.isSubmitting,
      self.formState.isValid,
      self.formState.isDirty,
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

      // For updates, filter out past dates before submitting (contract will reject them)
      const valuesToSubmit = isNewPot
        ? (values as PotDeploymentInputs)
        : filterPastDatesForSubmit(values as PotSettings);

      dispatch.potConfiguration.save({
        onDeploymentSuccess: ({ potId }: ByPotId) => router.push(`${rootPathnames.pot}/${potId}`),
        onUpdate: (config: PotConfig) => self.reset(potConfigToSettings(config)),
        ...(isNewPot ? valuesToSubmit : { potId, ...valuesToSubmit }),
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

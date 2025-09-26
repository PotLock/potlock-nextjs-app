import { useCallback, useMemo, useState } from "react";

import { SubmitHandler, useWatch } from "react-hook-form";
import { isDefined, objOf, pick } from "remeda";

import { SOCIAL_PLATFORM_NAME } from "@/common/_config";
import type { ByAccountId } from "@/common/types";
import { useEnhancedForm } from "@/common/ui/form/hooks";
import { type AccountGroupItem, useAccountSocialProfile } from "@/entities/_shared/account";

import { type ProfileSaveInputs, save } from "../models/effects";
import { addFundingSourceSchema, profileConfigurationSchema } from "../models/schemas";
import { AddFundingSourceInputs, ProfileConfigurationInputs } from "../models/types";
import { stripLinktree } from "../utils/normalization";

export type ProfileFormParams = ByAccountId &
  Pick<ProfileSaveInputs, "mode" | "isDao"> & {
    onSuccess: () => void;
    onFailure: (errorMessage: string) => void;
  };

export const useProfileForm = ({
  mode,
  accountId,
  isDao,
  onSuccess,
  onFailure,
}: ProfileFormParams) => {
  const {
    isLoading: isSocialProfileSnapshotLoading,
    profile: socialProfileSnapshot,
    avatar,
    cover,
    refetch: refetchSocialProfile,
    error: socialProfileSnapshotError,
  } = useAccountSocialProfile({ accountId, live: true });

  const defaultValues: Partial<ProfileConfigurationInputs> = useMemo(
    () => ({
      name: socialProfileSnapshot?.name,
      description: socialProfileSnapshot?.description,
      profileImage: avatar.isNft ? undefined : avatar.url,
      backgroundImage: cover.isNft ? undefined : cover.url,
      publicGoodReason: socialProfileSnapshot?.plPublicGoodReason,
      ...(socialProfileSnapshot?.linktree === undefined
        ? {}
        : stripLinktree(
            pick(socialProfileSnapshot.linktree, ["twitter", "telegram", "github", "website"]),
          )),

      categories:
        socialProfileSnapshot?.plCategories === undefined
          ? undefined
          : JSON.parse(socialProfileSnapshot.plCategories),

      teamMembers:
        socialProfileSnapshot?.plTeam === undefined
          ? undefined
          : JSON.parse(socialProfileSnapshot.plTeam),

      smartContracts:
        socialProfileSnapshot?.plSmartContracts === undefined
          ? undefined
          : JSON.parse(socialProfileSnapshot.plSmartContracts),

      fundingSources:
        socialProfileSnapshot?.plFundingSources === undefined
          ? undefined
          : JSON.parse(socialProfileSnapshot.plFundingSources),

      githubRepositories:
        socialProfileSnapshot?.plGithubRepos === undefined
          ? undefined
          : JSON.parse(socialProfileSnapshot.plGithubRepos),
    }),

    [avatar, cover, socialProfileSnapshot],
  );

  const { form: self } = useEnhancedForm({
    schema: profileConfigurationSchema,
    mode: "all",
    defaultValues,
    followDefaultValues: socialProfileSnapshot !== undefined && !isSocialProfileSnapshotLoading,
    resetOptions: { keepDirty: false, keepTouched: false },
  });

  //? For internal use only!
  const values = useWatch(self);

  const teamMembersAccountGroup: AccountGroupItem[] = useMemo(
    () => values.teamMembers?.map(objOf("accountId")) ?? [],
    [values.teamMembers],
  );

  const isDisabled = useMemo(
    () => !self.formState.isDirty || !self.formState.isValid || self.formState.isSubmitting,
    [self.formState.isDirty, self.formState.isSubmitting, self.formState.isValid],
  );

  const updateBackgroundImage = useCallback(
    (url: string) => self.setValue("backgroundImage", url, { shouldValidate: true }),
    [self],
  );

  const updateProfileImage = useCallback(
    (url: string) => self.setValue("profileImage", url, { shouldValidate: true }),
    [self],
  );

  const updateTeamMembers = useCallback(
    (members: string[]) => self.setValue("teamMembers", members, { shouldValidate: true }),
    [self],
  );

  const updateCategories = useCallback(
    (categories: string[]) => self.setValue("categories", categories, { shouldValidate: true }),
    [self],
  );

  const updateRepositories = useCallback(
    (repos: string[]) => self.setValue("githubRepositories", repos, { shouldValidate: true }),
    [self],
  );

  const addRepository = useCallback(
    () =>
      self.setValue("githubRepositories", [...(values.githubRepositories ?? []), ""], {
        shouldValidate: true,
      }),

    [self, values.githubRepositories],
  );

  const removeRepository = useCallback(
    (index: number) => {
      const updatedRepos = [...(values.githubRepositories ?? [])];
      updatedRepos.splice(index, 1);
      self.setValue("githubRepositories", updatedRepos, { shouldValidate: true });
    },
    [self, values.githubRepositories],
  );

  const updateRepository = useCallback(
    (index: number, value: string) => {
      const updatedRepos = [...(values.githubRepositories ?? [])];
      updatedRepos[index] = value;
      self.setValue("githubRepositories", updatedRepos, { shouldValidate: true });
    },
    [self, values.githubRepositories],
  );

  const addFundingSource = useCallback(
    (fundingSource: AddFundingSourceInputs) => {
      const currentSources = values.fundingSources ?? [];

      // Filter out any invalid entries and add the new one
      const validSources = currentSources.filter(
        (source) =>
          source.investorName && source.description && source.amountReceived && source.denomination,
      ) as AddFundingSourceInputs[];

      const updatedSources = [...validSources, fundingSource];
      self.setValue("fundingSources", updatedSources, { shouldValidate: true });
    },
    [self, values.fundingSources],
  );

  const updateFundingSource = useCallback(
    (index: number, fundingSource: AddFundingSourceInputs) => {
      const currentSources = values.fundingSources ?? [];

      // Filter out any invalid entries
      const validSources = currentSources.filter(
        (source) =>
          source.investorName && source.description && source.amountReceived && source.denomination,
      ) as AddFundingSourceInputs[];

      const updatedSources = [...validSources];
      updatedSources[index] = fundingSource;
      self.setValue("fundingSources", updatedSources, { shouldValidate: true });
    },
    [self, values.fundingSources],
  );

  const removeFundingSource = useCallback(
    (index: number) => {
      const currentSources = values.fundingSources ?? [];

      // Filter out any invalid entries
      const validSources = currentSources.filter(
        (source) =>
          source.investorName && source.description && source.amountReceived && source.denomination,
      ) as AddFundingSourceInputs[];

      const updatedSources = [...validSources];
      updatedSources.splice(index, 1);
      self.setValue("fundingSources", updatedSources, { shouldValidate: true });
    },
    [self, values.fundingSources],
  );

  const addSmartContract = useCallback(
    (contract: [string, string]) => {
      const updatedContracts = [...(values.smartContracts ?? []), contract];
      self.setValue("smartContracts", updatedContracts, { shouldValidate: true });
    },
    [self, values.smartContracts],
  );

  const updateSmartContract = useCallback(
    (index: number, contract: [string, string]) => {
      const updatedContracts = [...(values.smartContracts ?? [])];
      updatedContracts[index] = contract;
      self.setValue("smartContracts", updatedContracts, { shouldValidate: true });
    },
    [self, values.smartContracts],
  );

  const removeSmartContract = useCallback(
    (index: number) => {
      const updatedContracts = [...(values.smartContracts ?? [])];
      updatedContracts.splice(index, 1);
      self.setValue("smartContracts", updatedContracts, { shouldValidate: true });
    },
    [self, values.smartContracts],
  );

  const onSubmit: SubmitHandler<ProfileConfigurationInputs> = useCallback(
    (inputs) => {
      if (isDefined(socialProfileSnapshotError)) {
        console.error(socialProfileSnapshotError);
        onFailure(`Unable to retrieve ${SOCIAL_PLATFORM_NAME} profile`);
      } else {
        save({ accountId, isDao, mode, inputs, socialProfileSnapshot })
          .then(({ success, error }) => {
            if (success) {
              refetchSocialProfile().then(() => self.reset(defaultValues));
              onSuccess();
            } else {
              onFailure(error ?? "Unknown error");
              console.error(error);
            }
          })
          .catch((error) => {
            console.error(error);
            onFailure(error ?? "Unknown error");
          });
      }
    },

    [
      accountId,
      defaultValues,
      isDao,
      mode,
      onFailure,
      onSuccess,
      refetchSocialProfile,
      self,
      socialProfileSnapshot,
      socialProfileSnapshotError,
    ],
  );

  return {
    form: self,
    isDisabled,
    teamMembersAccountGroup,
    updateBackgroundImage,
    updateCategories,
    updateProfileImage,
    addRepository,
    removeRepository,
    updateRepository,
    updateRepositories,
    updateTeamMembers,
    addFundingSource,
    updateFundingSource,
    removeFundingSource,
    addSmartContract,
    updateSmartContract,
    removeSmartContract,
    onSubmit: self.handleSubmit(onSubmit),
    resetForm: self.reset,
  };
};

export const useAddFundingSourceForm = (options: {
  defaultValues?: Partial<AddFundingSourceInputs>;
  onSuccess?: () => void;
}) => {
  const { form } = useEnhancedForm({
    schema: addFundingSourceSchema,
    mode: "onChange",
    defaultValues: options.defaultValues,
    followDefaultValues: true,
  });

  const values = useWatch({ control: form.control });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit: SubmitHandler<AddFundingSourceInputs> = useCallback(
    async (_) => {
      setSubmitting(true);

      try {
        // Funding source saving logic here
        options.onSuccess?.();
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
    [options],
  );

  return {
    form,
    errors: form.formState.errors,
    values,
    isSubmitting: submitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
};

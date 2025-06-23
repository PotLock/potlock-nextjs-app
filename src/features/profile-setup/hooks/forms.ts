import { useCallback, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { evolve, objOf, pick } from "remeda";

import type { ByAccountId } from "@/common/types";
import { useEnhancedForm } from "@/common/ui/form/hooks";
import {
  type AccountGroupItem,
  getLinktreeLeafExtractor,
  useAccountSocialProfile,
} from "@/entities/_shared/account";

import { type ProfileSaveInputs, save } from "../models/effects";
import { addFundingSourceSchema, profileSetupSchema } from "../models/schemas";
import { AddFundingSourceInputs, ProfileSetupInputs } from "../models/types";
import { stripLinktree } from "../utils/normalization";

export type ProfileFormParams = ByAccountId &
  Pick<ProfileSaveInputs, "mode" | "isDaoRepresentative"> & {
    onSuccess: () => void;
    onFailure: (errorMessage: string) => void;
  };

export const useProfileForm = ({
  mode,
  accountId,
  isDaoRepresentative,
  onSuccess,
  onFailure,
}: ProfileFormParams) => {
  const {
    isLoading: isSocialProfileSnapshotLoading,
    profile: socialProfileSnapshot,
    avatar,
    cover,
    refetch: refetchSocialProfile,
  } = useAccountSocialProfile({ accountId });

  const defaultValues: Partial<ProfileSetupInputs> = useMemo(
    () => ({
      name: socialProfileSnapshot?.name,
      description: socialProfileSnapshot?.description,
      profileImage: avatar.isNft ? undefined : avatar.url,
      backgroundImage: cover.isNft ? undefined : cover.url,
      publicGoodReason: socialProfileSnapshot?.plPublicGoodReason,

      categories:
        socialProfileSnapshot?.plCategories === undefined
          ? undefined
          : JSON.parse(socialProfileSnapshot.plCategories),

      githubRepositories:
        socialProfileSnapshot?.plGithubRepos === undefined
          ? undefined
          : JSON.parse(socialProfileSnapshot.plGithubRepos),

      teamMembers:
        socialProfileSnapshot?.plTeam === undefined
          ? undefined
          : JSON.parse(socialProfileSnapshot.plTeam),

      ...(socialProfileSnapshot?.linktree === undefined
        ? {}
        : stripLinktree(
            pick(socialProfileSnapshot.linktree, ["twitter", "telegram", "github", "website"]),
          )),
    }),

    [avatar, cover, socialProfileSnapshot],
  );

  const { form: self } = useEnhancedForm({
    schema: profileSetupSchema,
    mode: "all",
    defaultValues,
    followDefaultValues: socialProfileSnapshot !== undefined && !isSocialProfileSnapshotLoading,
    resetOptions: { keepDirty: false, keepTouched: false },
  });

  //? For internal use only!
  const values = useWatch(self);

  console.log(stripLinktree(pick(values, ["twitter", "telegram", "github", "website"])));

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

  const onSubmit: SubmitHandler<ProfileSetupInputs> = useCallback(
    (inputs) => {
      save({ accountId, isDaoRepresentative, mode, inputs, socialProfileSnapshot })
        .then((result) => {
          if (result.success) {
            refetchSocialProfile().then(() => self.reset(defaultValues));
            onSuccess();
          } else {
            onFailure(result.error);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

    [
      accountId,
      defaultValues,
      isDaoRepresentative,
      mode,
      onFailure,
      onSuccess,
      refetchSocialProfile,
      self,
      socialProfileSnapshot,
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
    updateRepositories,
    updateTeamMembers,
    onSubmit: self.handleSubmit(onSubmit),
    resetForm: self.reset,
  };
};

export const useAddFundingSourceForm = (options: {
  defaultValues?: Partial<AddFundingSourceInputs>;
  onSuccess?: () => void;
}) => {
  const form = useForm<AddFundingSourceInputs>({
    resolver: zodResolver(addFundingSourceSchema),
    mode: "onChange",
    defaultValues: {
      description: "",
      investorName: "",
      amountReceived: "",
      denomination: "",
      date: undefined,
    },
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

import { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { isDeepEqual, keys, objOf, pick } from "remeda";
import { ZodError } from "zod";

import type { ByAccountId } from "@/common/types";
import { type AccountGroupItem, useAccountSocialProfile } from "@/entities/_shared/account";

import { type ProfileSaveInputs, save } from "../models/effects";
import { addFundingSourceSchema, profileSetupSchema } from "../models/schemas";
import { AddFundingSourceInputs, ProfileSetupInputs } from "../models/types";

export type ProfileSetupFormParams = ByAccountId &
  Pick<ProfileSaveInputs, "mode" | "isDaoRepresentative"> & {
    onSuccess: () => void;
    onFailure: (errorMessage: string) => void;
  };

export const useProfileSetupForm = ({
  mode,
  accountId,
  isDaoRepresentative,
  onSuccess,
  onFailure,
}: ProfileSetupFormParams) => {
  const [crossFieldErrors, setCrossFieldErrors] = useState<FieldErrors<ProfileSetupInputs>>({});

  const {
    isLoading: isSocialProfileSnapshotLoading,
    profile: socialProfileSnapshot,
    avatarSrc,
    backgroundSrc,
    refetch: refetchSocialProfile,
  } = useAccountSocialProfile({ accountId });

  const defaultValues: Partial<ProfileSetupInputs> = useMemo(
    () => ({
      name: socialProfileSnapshot?.name,
      description: socialProfileSnapshot?.description,
      backgroundImage: backgroundSrc,
      profileImage: avatarSrc,

      publicGoodReason: socialProfileSnapshot?.plPublicGoodReason,

      teamMembers: socialProfileSnapshot?.plTeam
        ? JSON.parse(socialProfileSnapshot.plTeam)
        : undefined,

      categories: socialProfileSnapshot?.plCategories
        ? JSON.parse(socialProfileSnapshot.plCategories)
        : undefined,

      githubRepositories: socialProfileSnapshot?.plGithubRepos
        ? JSON.parse(socialProfileSnapshot.plGithubRepos)
        : undefined,
    }),

    [avatarSrc, backgroundSrc, socialProfileSnapshot],
  );

  const self = useForm<ProfileSetupInputs>({
    resolver: zodResolver(profileSetupSchema),
    mode: "all",
    defaultValues,
    resetOptions: { keepDirty: false, keepTouched: false },
  });

  //? For internal use only!
  const values = useWatch(self);

  const isUnpopulated =
    !isDeepEqual(defaultValues, pick(self.formState.defaultValues ?? {}, keys(defaultValues))) &&
    !self.formState.isDirty;

  useEffect(() => {
    if (socialProfileSnapshot !== undefined && !isSocialProfileSnapshotLoading && isUnpopulated) {
      self.reset(defaultValues);
    }
  }, [
    defaultValues,
    isSocialProfileSnapshotLoading,
    isUnpopulated,
    self,
    socialProfileSnapshot,
    values,
  ]);

  const teamMembersAccountGroup: AccountGroupItem[] = useMemo(
    () => values.teamMembers?.map(objOf("accountId")) ?? [],
    [values.teamMembers],
  );

  // Cross-field validation
  useEffect(() => {
    void profileSetupSchema
      .parseAsync(values)
      .then(() => setCrossFieldErrors({}))
      .catch((error: ZodError) =>
        // TODO: Consider using `setError` in forEach if there are any troubles with error display
        setCrossFieldErrors(
          error?.issues.reduce((schemaErrors, { code, message, path }) => {
            const fieldPath = path.at(0);

            return typeof fieldPath === "string" && code === "custom"
              ? { ...schemaErrors, [fieldPath]: { message, type: code } }
              : schemaErrors;
          }, {}),
        ),
      );
  }, [values]);

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
    form: {
      ...self,

      formState: {
        ...self.formState,
        errors: { ...self.formState.errors, ...crossFieldErrors },
      },
    },

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

// Funding Source Form Hook
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
    form: {
      ...form,

      formState: {
        ...form.formState,
        errors: form.formState.errors,
      },
    },
    errors: form.formState.errors,
    values,
    isSubmitting: submitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
};

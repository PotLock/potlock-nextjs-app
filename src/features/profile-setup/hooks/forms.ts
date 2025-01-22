import { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { ZodError } from "zod";

import type { ByAccountId } from "@/common/types";
import { useSession } from "@/entities/_shared/session";

import { type ProfileSaveInputs, save } from "../models/effects";
import { addFundingSourceSchema, profileSetupSchema } from "../models/schemas";
import { AddFundingSourceInputs, ProfileSetupInputs } from "../models/types";

export type ProfileSetupFormParams = ByAccountId &
  Pick<ProfileSaveInputs, "mode"> & {
    onSuccess: () => void;
    onFailure: (errorMessage: string) => void;
    defaultValues?: Partial<ProfileSetupInputs>;
  };

export const useProfileSetupForm = ({
  accountId,
  mode,
  onSuccess,
  onFailure,
  defaultValues,
}: ProfileSetupFormParams) => {
  const [submitting, setSubmitting] = useState(false);

  const [crossFieldErrors, setCrossFieldErrors] = useState<FieldErrors<ProfileSetupInputs>>({});
  const { isSignedIn } = useSession();

  const self = useForm<ProfileSetupInputs>({
    resolver: zodResolver(profileSetupSchema),
    mode: "onChange",
    defaultValues,

    resetOptions: {
      keepDefaultValues: true,
      keepDirty: false,
    },
  });

  const values = useWatch({ control: self.control });

  const isDisabled = useMemo(
    () => !self.formState.isDirty || !self.formState.isValid || self.formState.isSubmitting,
    [self.formState.isDirty, self.formState.isSubmitting, self.formState.isValid],
  );

  // Cross-field validation
  useEffect(() => {
    void profileSetupSchema
      .parseAsync(values)
      .then(() => setCrossFieldErrors({}))
      .catch((error: ZodError) =>
        // TODO: Consider using `setError` in forEach ( in the future )
        setCrossFieldErrors(
          error?.issues.reduce((errors, { code, message, path }) => {
            const fieldPath = path.at(0);
            return typeof fieldPath === "string" && code === "custom"
              ? { ...errors, [fieldPath]: { message, type: code } }
              : errors;
          }, {}),
        ),
      );
  }, [values]);

  const updateBackgroundImage = useCallback(
    (url: string) => {
      self.setValue("backgroundImage", url, { shouldValidate: true });
    },

    [self],
  );

  const updateProfileImage = useCallback(
    (url: string) => {
      self.setValue("profileImage", url, { shouldValidate: true });
    },

    [self],
  );

  // Form update handlers
  const updateTeamMembers = useCallback(
    (members: string[]) => {
      self.setValue("teamMembers", members, { shouldValidate: true });
    },
    [self],
  );

  const updateCategories = useCallback(
    (categories: string[]) => {
      self.setValue("categories", categories, { shouldValidate: true });
    },
    [self],
  );

  const updateRepositories = useCallback(
    (repos: string[]) => {
      self.setValue("githubRepositories", repos, { shouldValidate: true });
    },
    [self],
  );

  const addRepository = useCallback(() => {
    const currentRepos = values.githubRepositories || [];
    self.setValue("githubRepositories", [...currentRepos, ""], { shouldValidate: true });
  }, [self, values.githubRepositories]);

  const onSubmit: SubmitHandler<ProfileSetupInputs> = useCallback(
    (inputs) => {
      if (isSignedIn) {
        setSubmitting(true);

        // TODO: pass `isDaoRepresentative` to this effect instead of storing `isDao` as a form field
        save({ accountId, isDaoRepresentative: false, mode, data: inputs })
          .then((result) => {
            if (result.success) {
              onSuccess();
            } else {
              onFailure(result.error);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },

    [accountId, isSignedIn, mode, onFailure, onSuccess],
  );

  return {
    form: {
      ...self,
      formState: {
        ...self.formState,
        errors: { ...self.formState.errors, ...crossFieldErrors },
      },
    },

    errors: self.formState.errors,
    values,
    isDisabled,
    isSubmitting: submitting,
    updateBackgroundImage,
    updateCategories,
    updateProfileImage,
    updateRepositories,
    updateTeamMembers,
    addRepository,
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

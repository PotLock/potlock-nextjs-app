import { useCallback, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { ZodError } from "zod";

import { useSession } from "@/entities/_shared/session";
import { dispatch } from "@/store";

import { saveProject } from "../models/effects";
import { addFundingSourceSchema, projectEditorSchema } from "../models/schemas";
import { AddFundingSourceInputs, ProjectEditorInputs } from "../models/types";

// Project Editor Form Hook
export const useProjectEditorForm = (options: {
  defaultValues?: Partial<ProjectEditorInputs>;
  onSuccess?: () => void;
  isEdit: boolean;
}) => {
  const [submitting, setSubmitting] = useState(false);

  const [crossFieldErrors, setCrossFieldErrors] = useState<FieldErrors<ProjectEditorInputs>>({});
  const { isSignedIn } = useSession();

  const form = useForm<ProjectEditorInputs>({
    resolver: zodResolver(projectEditorSchema),
    mode: "onChange",
    defaultValues: {},
  });

  const values = useWatch({ control: form.control });

  // Cross-field validation
  useEffect(() => {
    void projectEditorSchema
      .parseAsync(values)
      .then(() => setCrossFieldErrors({}))
      .catch((error: ZodError) =>
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

  // Form update handlers
  const updateTeamMembers = useCallback(
    (members: string[]) => {
      form.setValue("teamMembers", members, { shouldValidate: true });
    },
    [form],
  );

  const updateCategories = useCallback(
    (categories: string[]) => {
      form.setValue("categories", categories, { shouldValidate: true });
    },
    [form],
  );

  const updateRepositories = useCallback(
    (repos: string[]) => {
      form.setValue("githubRepositories", repos, { shouldValidate: true });
    },
    [form],
  );

  const addRepository = useCallback(() => {
    const currentRepos = values.githubRepositories || [];
    form.setValue("githubRepositories", [...currentRepos, ""], { shouldValidate: true });
  }, [form, values.githubRepositories]);

  const onSubmit: SubmitHandler<ProjectEditorInputs> = useCallback(
    async (_) => {
      // not using form data, using store data provided by form
      if (isSignedIn) {
        setSubmitting(true);

        saveProject({ isEdit: options.isEdit })
          .then(async (result) => {
            if (result.success) {
              console.log("Opening wallet for approval...");
            } else {
              dispatch.projectEditor.submissionStatus("pending");
              console.log("error while saving");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    [isSignedIn, options.isEdit],
  );

  return {
    form: {
      ...form,
      formState: {
        ...form.formState,
        errors: { ...form.formState.errors, ...crossFieldErrors },
      },
    },
    errors: form.formState.errors,
    values,
    isSubmitting: submitting,
    updateTeamMembers,
    updateCategories,
    updateRepositories,
    addRepository,
    onSubmit: form.handleSubmit(onSubmit),
    resetForm: form.reset,
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

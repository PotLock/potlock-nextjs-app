import { useCallback, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { validateNearAddress } from "@wpdas/naxios";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { ZodError } from "zod";

import { useWallet } from "@/entities/_shared/session";
import { dispatch, store } from "@/store";

import { saveProject } from "../models/effects";
import { addFundingSourceSchema, projectEditorSchema } from "../models/schemas";
import { AddFundingSourceInputs, ProjectEditorInputs } from "../models/types";

export const useProjectEditorForm = () => {
  const form = useForm<ProjectEditorInputs>({
    resolver: zodResolver(projectEditorSchema),
    mode: "onChange",
    resetOptions: { keepDirtyValues: false },
    defaultValues: {
      name: "",
      isDao: false,
      daoAddress: "",
      backgroundImage: "",
      profileImage: "",
      teamMembers: [],
      categories: [],
      description: "",
      publicGoodReason: "",
      smartContracts: [],
      fundingSources: [],
      githubRepositories: [],
      website: "",
      twitter: "",
      telegram: "",
      github: "",
    },
  });

  // Watch form values for cross-field validation
  const values = useWatch(form);

  // Track cross-field validation errors
  const [crossFieldErrors, setCrossFieldErrors] = useState<FieldErrors<ProjectEditorInputs>>({});

  // Handle cross-field validation
  useEffect(() => {
    void projectEditorSchema
      .parseAsync(values)
      .then(() => setCrossFieldErrors({}))
      .catch((error: ZodError) =>
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

  const { wallet } = useWallet();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit: SubmitHandler<ProjectEditorInputs> = useCallback(
    async (formData) => {
      if (!wallet) return;

      const data = store.getState().projectEditor;

      const accountId = data.isDao ? data.daoAddress : data.accountId;

      if (!accountId) {
        return { success: false, error: "No accountId provided" };
      }

      // Validate DAO Address
      const isDaoAddressValid = data.isDao ? validateNearAddress(data.daoAddress || "") : true;

      if (!isDaoAddressValid) {
        return { success: false, error: "DAO: Invalid NEAR account Id" };
      }

      setSubmitting(true);

      try {
        const result = await saveProject(formData, accountId);

        if (result.success) {
          console.log("Opening wallet for approval...");
        } else {
          dispatch.projectEditor.submissionStatus("pending");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }

      // // not using form data, using store data provided by form
      // if (wallet) {
      //   dispatch.projectEditor.submissionStatus("sending");

      //   const data = store.getState().projectEditor;

      //   const accountId = data.isDao ? data.daoAddress : data.accountId;

      //   if (!accountId) {
      //     return { success: false, error: "No accountId provided" };
      //   }

      //   // Validate DAO Address
      //   const isDaoAddressValid = data.isDao ? validateNearAddress(data.daoAddress || "") : true;

      //   if (!isDaoAddressValid) {
      //     return { success: false, error: "DAO: Invalid NEAR account Id" };
      //   }

      //   saveProject(data, accountId).then(async (result) => {
      //     if (result.success) {
      //       console.log("Opening wallet for approval...");
      //     } else {
      //       dispatch.projectEditor.submissionStatus("pending");
      //     }
      //   });
      // }
    },
    [wallet],
  );

  return {
    form: {
      ...form,
      formState: {
        ...form.formState,
        errors: { ...form.formState.errors, ...crossFieldErrors },
      },
    },
    isSubmitting: submitting,
    errors: form.formState.errors,
    onSubmit: form.handleSubmit(onSubmit),
    values,
  };
};

export const useAddFundingSourceForm = () => {
  const form = useForm<AddFundingSourceInputs>({
    resolver: zodResolver(addFundingSourceSchema),
  });

  return {
    form,
    errors: form.formState.errors,
  };
};

import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { useViewerSession } from "@/common/viewer";
import { dispatch } from "@/store";

import { saveProject } from "../models/effects";
import { addFundingSourceSchema, projectEditorSchema } from "../models/schemas";
import { AddFundingSourceInputs, ProjectEditorInputs } from "../models/types";

export const useProjectEditorForm = () => {
  const viewer = useViewerSession();

  const form = useForm<ProjectEditorInputs>({
    resolver: zodResolver(projectEditorSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ProjectEditorInputs> = useCallback(
    async (_) => {
      // not using form data, using store data provided by form
      if (viewer.isSignedIn) {
        dispatch.projectEditor.submissionStatus("sending");

        saveProject().then(async (result) => {
          if (result.success) {
            console.log("Opening wallet for approval...");
          } else {
            dispatch.projectEditor.submissionStatus("pending");
          }
        });
      }
    },
    [viewer],
  );

  return {
    form,
    errors: form.formState.errors,
    onSubmit: form.handleSubmit(onSubmit),
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

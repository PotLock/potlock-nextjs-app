import { useCallback, useEffect } from "react";

import { TextAreaField } from "@/common/ui/form/components";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
} from "@/common/ui/layout/components";

import { CustomInput } from "./editor-elements";
import { useAddFundingSourceForm } from "../hooks/forms";
import { AddFundingSourceInputs, type ProfileConfigurationInputs } from "../models/types";

export type ProfileConfigurationFundingSourceModalProps = {
  data: ProfileConfigurationInputs["fundingSources"];
  open?: boolean;
  onCloseClick?: () => void;
  editFundingIndex?: number;
  onAddFundingSource?: (fundingSource: AddFundingSourceInputs) => void;
  onUpdateFundingSource?: (index: number, fundingSource: AddFundingSourceInputs) => void;
};

export const ProfileConfigurationFundingSourceModal: React.FC<
  ProfileConfigurationFundingSourceModalProps
> = ({
  data: fundingSources = [],
  open,
  onCloseClick,
  editFundingIndex,
  onAddFundingSource,
  onUpdateFundingSource,
}) => {
  const { form, errors } = useAddFundingSourceForm({
    defaultValues:
      editFundingIndex !== undefined && fundingSources[editFundingIndex]
        ? fundingSources[editFundingIndex]
        : {
            description: "",
            investorName: "",
            amountReceived: "",
            denomination: "",
            date: "",
          },
    onSuccess: () => {
      if (onCloseClick) {
        onCloseClick();
      }
    },
  });

  const isEdit = editFundingIndex !== undefined;

  const resetForm = useCallback(() => {
    setTimeout(form.reset, 500);
  }, [form]);

  const onSubmitFundingSourceHandler = useCallback(
    (data: AddFundingSourceInputs) => {
      if (onAddFundingSource) {
        onAddFundingSource(data);
      }

      if (onCloseClick) {
        onCloseClick();
      }

      resetForm();
    },
    [resetForm, onCloseClick, onAddFundingSource],
  );

  useEffect(() => {
    if (editFundingIndex !== undefined && fundingSources[editFundingIndex]) {
      form.setValue("description", fundingSources[editFundingIndex].description ?? "");
      form.setValue("investorName", fundingSources[editFundingIndex].investorName ?? "");
      form.setValue("amountReceived", fundingSources[editFundingIndex].amountReceived ?? "");
      form.setValue("denomination", fundingSources[editFundingIndex].denomination ?? "");
      form.setValue("date", fundingSources[editFundingIndex].date ?? "");
    }
  }, [editFundingIndex, fundingSources, form]);

  const onSubmitEditedFundingSourceHandler = useCallback(
    (data: AddFundingSourceInputs) => {
      if (isEdit && editFundingIndex !== undefined && onUpdateFundingSource) {
        onUpdateFundingSource(editFundingIndex, data);
        resetForm();
      }

      if (onCloseClick) {
        onCloseClick();
      }
    },
    [editFundingIndex, isEdit, resetForm, onCloseClick, onUpdateFundingSource],
  );

  const onCloseHandler = useCallback(() => {
    if (onCloseClick) {
      onCloseClick();
    }

    resetForm();
  }, [resetForm, onCloseClick]);

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130 max-h-screen" onCloseClick={onCloseHandler}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Funding Source" : "Add Funding Source"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              isEdit ? onSubmitEditedFundingSourceHandler : onSubmitFundingSourceHandler,
            )}
            className="flex h-full flex-col overflow-y-scroll p-6"
          >
            <FormField
              control={form.control}
              name="investorName"
              render={({ field }) => (
                <CustomInput
                  label="Name of investor"
                  inputProps={{
                    placeholder: "Enter investor name",
                    error: errors.investorName?.message,
                    ...field,
                  }}
                />
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <CustomInput
                  className="pt-8"
                  label="Date"
                  optional
                  inputProps={{
                    type: "date",
                    placeholder: "Enter investor name",
                    ...field,
                  }}
                />
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <TextAreaField
                  label="Description"
                  required
                  placeholder="Type description"
                  maxLength={250}
                  className="pt-8"
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="denomination"
              render={({ field }) => (
                <CustomInput
                  className="pt-8"
                  label="Denomination of investment"
                  inputProps={{
                    placeholder: "e.g. NEAR, USD, USDC, etc.",
                    ...field,
                  }}
                />
              )}
            />

            <FormField
              control={form.control}
              name="amountReceived"
              render={({ field }) => (
                <CustomInput
                  className="pt-8"
                  label="Investment amount"
                  inputProps={{
                    type: "number",
                    placeholder: "e.g. 1000",
                    ...field,
                  }}
                />
              )}
            />

            <Button
              className="mt-6 self-end"
              type="submit"
              variant="standard-filled"
              disabled={!form.formState.isValid}
            >
              {isEdit ? "Save Changes" : "Add Funding Source"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

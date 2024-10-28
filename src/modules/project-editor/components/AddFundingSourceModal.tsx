import { useCallback } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
} from "@/common/ui/components";
import { dispatch, useTypedSelector } from "@/store";

import { CustomInput, CustomTextForm } from "./CreateForm/components";
import { useAddFundingSourceForm } from "../hooks/forms";
import { AddFundingSourceInputs } from "../models/types";

type Props = {
  open?: boolean;
  onCloseClick?: () => void;
  editFundingIndex?: number;
};

const AddFundingSourceModal = ({
  open,
  onCloseClick,
  editFundingIndex,
}: Props) => {
  const { form, errors } = useAddFundingSourceForm();
  const fundingSources = useTypedSelector(
    (state) => state.projectEditor.fundingSources || [],
  );
  const isEdit = editFundingIndex !== undefined;

  const resetForm = useCallback(() => {
    setTimeout(form.reset, 500);
  }, [form]);

  const onSubmitFundingSourceHandler = useCallback(
    (data: AddFundingSourceInputs) => {
      dispatch.projectEditor.addFundingSource(data);
      if (onCloseClick) {
        onCloseClick();
      }
      resetForm();
    },
    [resetForm, onCloseClick],
  );

  const onSubmitEditedFundingSourceHandler = useCallback(
    (data: AddFundingSourceInputs) => {
      if (isEdit && editFundingIndex !== undefined) {
        dispatch.projectEditor.updateFundingSource({
          fundingSourceData: data,
          index: editFundingIndex,
        });

        resetForm();
      }

      if (onCloseClick) {
        onCloseClick();
      }
    },
    [editFundingIndex, isEdit, resetForm, onCloseClick],
  );

  const onCloseHandler = useCallback(() => {
    if (onCloseClick) {
      onCloseClick();
    }

    resetForm();
  }, [resetForm, onCloseClick]);

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-130 max-h-screen"
        onCloseClick={onCloseHandler}
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Funding Source" : "Add Funding Source"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              isEdit
                ? onSubmitEditedFundingSourceHandler
                : onSubmitFundingSourceHandler,
            )}
            className="flex h-full flex-col overflow-y-scroll p-6"
          >
            <FormField
              control={form.control}
              name="investorName"
              defaultValue={
                isEdit ? fundingSources[editFundingIndex].investorName : ""
              }
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
              defaultValue={isEdit ? fundingSources[editFundingIndex].date : ""}
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
              defaultValue={
                isEdit ? fundingSources[editFundingIndex].description : ""
              }
              render={({ field }) => (
                <CustomTextForm
                  className="pt-8"
                  label="Description"
                  placeholder="Type description"
                  error={errors.description?.message}
                  field={field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="denomination"
              defaultValue={
                isEdit ? fundingSources[editFundingIndex].denomination : ""
              }
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
              defaultValue={
                isEdit ? fundingSources[editFundingIndex].amountReceived : ""
              }
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

export default AddFundingSourceModal;

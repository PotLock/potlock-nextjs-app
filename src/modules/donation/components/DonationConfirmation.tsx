import { UseFormReturn } from "react-hook-form";

import { DialogHeader, DialogTitle } from "@/common/ui/components";

import { DonationInputs } from "../models";

export type DonationConfirmationProps = {
  form: UseFormReturn<DonationInputs>;
};

export const DonationConfirmation = ({ form }: DonationConfirmationProps) => {
  const values = form.watch();

  console.table(values);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{"Confirm donation"}</DialogTitle>
      </DialogHeader>
    </>
  );
};

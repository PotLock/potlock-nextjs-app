import { UseFormReturn } from "react-hook-form";

import { DonationInputs } from "../models";

export type DonationConfirmationProps = {
  form: UseFormReturn<DonationInputs>;
};

export const DonationConfirmation = ({
  form: _,
}: DonationConfirmationProps) => {
  return (
    <div>
      <h1>Confirm donation</h1>
    </div>
  );
};

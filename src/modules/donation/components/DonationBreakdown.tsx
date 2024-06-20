import { UseFormReturn } from "react-hook-form";

import { Checkbox } from "@/common/ui/components";

import { useDonationFees } from "../hooks/fees";
import { DonationInputs } from "../models";

export type DonationBreakdownProps = {
  form: UseFormReturn<DonationInputs>;
};

export const DonationBreakdown: React.FC<DonationBreakdownProps> = ({
  form,
}) => {
  const values = form.watch();

  const fees = useDonationFees(values);

  return (
    <>
      <div un-flex="~ col" un-gap="2">
        <span className="prose" un-text="neutral-600" un-font="600">
          Breakdown
        </span>

        <div
          un-flex="~ col"
          un-gap="2"
          un-p="4"
          un-border="~ neutral-300 rounded-lg"
        >
          <div className="flex justify-between gap-4">
            <span>Project allocation (92.5%)</span>

            <span className="flex items-center gap-1">
              <span>46.25</span>
              <span>N</span>
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span>Protocol fees (5%)</span>

            <span className="flex items-center gap-1">
              <span>2.5</span>
              <span>N</span>
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span>Chef fees (5%)</span>

            <span className="flex items-center gap-1">
              <span>2.5</span>
              <span>N</span>
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span>Referral fees (2.5%)</span>

            <span className="flex items-center gap-1">
              <span>1.25</span>
              <span>N</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox id="protocol-fees" />

          <label htmlFor="protocol-fees" className="flex items-center gap-2">
            <span>Remove 5% Protocol Fees</span>

            <span className="flex items-center gap-1">
              <span role="img" aria-label="icon">
                🌐
              </span>

              <span>impact.sputnik.dao.near</span>
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="chef-fees" />

          <label htmlFor="chef-fees" className="flex items-center gap-2">
            <span>Remove 5% Chef Fees</span>

            <span className="flex items-center gap-1">
              <span role="img" aria-label="icon">
                🌐
              </span>
              <span>#build</span>
            </span>
          </label>
        </div>
      </div>
    </>
  );
};

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
  // !TODO: determine the source
  const referrerId = undefined;

  const {
    projectAllocationAmount,
    projectAllocationPercent,
    protocolFeeAmount,
    protocolFeePercent,
    protocolFeeRecipientAccountId,
    referrerFeeAmount,
    referrerFeePercent,
    chefFeeAmount,
    chefFeePercent,
  } = useDonationFees(values);

  const totalFees = [
    {
      label: "Project allocation",
      amount: projectAllocationAmount,
      percentage: projectAllocationPercent,
      show: true,
    },

    {
      label: "Protocol fees",
      amount: protocolFeeAmount,
      percentage: protocolFeePercent,
      show: !values.bypassProtocolFee,
    },

    {
      label: "Chef fees",
      amount: chefFeeAmount,
      percentage: chefFeePercent,
      show: !values.bypassChefFee && chefFeeAmount > 0,
    },

    {
      label: "Referral fees",
      amount: referrerFeeAmount,
      percentage: referrerFeePercent,
      show: referrerId,
    },

    {
      label: "On-chain Storage fee",
      amount: "<0.01",
      percentage: "",
      show: true,
    },
  ];

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
          {totalFees.map(({ label, amount, percentage }) => (
            <div un-flex="~" un-justify="between" un-gap="4" key={label}>
              <span className="prose">{`${label} (${percentage}%)`}</span>

              <span className="flex items-center gap-1">
                <span className="prose">{amount}</span>
                <span>{values.token}</span>
              </span>
            </div>
          ))}
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

              <span>{protocolFeeRecipientAccountId}</span>
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

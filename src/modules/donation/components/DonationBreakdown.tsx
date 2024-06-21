import { UseFormReturn } from "react-hook-form";

import { potlock } from "@/common/api/potlock";
import { Checkbox } from "@/common/ui/components";
import { ProfileLink } from "@/modules/profile";

import { useDonationFees } from "../hooks/fees";
import { DonationInputs } from "../models";

export type DonationBreakdownProps = {
  form: UseFormReturn<DonationInputs>;
};

export const DonationBreakdown: React.FC<DonationBreakdownProps> = ({
  form,
}) => {
  const values = form.watch();

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

  const computedTotalFees = [
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
      show: !values.bypassProtocolFee && protocolFeeAmount > 0,
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
      show: values.referrerAccountId && referrerFeeAmount > 0,
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
          {computedTotalFees.map(({ label, amount, percentage }) => (
            <div un-flex="~" un-justify="between" un-gap="4" key={label}>
              <span className="prose">{`${label} (${percentage}%)`}</span>

              <span className="flex items-center gap-1">
                <span className="prose">{amount}</span>
                <span>{values.token}</span>
              </span>
            </div>
          ))}

          <div un-flex="~" un-justify="between" un-gap="4">
            <span className="prose">{"On-Chain Storage fee"}</span>

            <span className="flex items-center gap-1">
              <span className="prose">{"< 0.01"}</span>
              <span>NEAR</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {protocolFeeRecipientAccountId && (
          <div className="flex items-center gap-2">
            <Checkbox id="protocol-fees" />

            <label htmlFor="protocol-fees" className="flex items-center gap-2">
              <span className="prose">{`Remove ${protocolFeePercent}% Protocol Fees`}</span>
              <ProfileLink accountId={protocolFeeRecipientAccountId} />
            </label>
          </div>
        )}

        {values.allocationStrategy === "pot" && (
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
        )}
      </div>
    </>
  );
};

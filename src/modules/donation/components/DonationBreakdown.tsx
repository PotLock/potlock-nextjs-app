import { UseFormReturn } from "react-hook-form";

import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { FormField } from "@/common/ui/components";
import { CheckboxField } from "@/common/ui/form-fields";
import { TokenIcon } from "@/modules/core";
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
    },

    {
      label: "Protocol fees",
      amount: protocolFeeAmount,
      percentage: protocolFeePercent,
      display: protocolFeeAmount > 0,
    },

    {
      label: "Chef fees",
      amount: chefFeeAmount,
      percentage: chefFeePercent,
      display: chefFeeAmount > 0,
    },

    {
      label: "Referral fees",
      amount: referrerFeeAmount,
      percentage: referrerFeePercent,
      display: referrerFeeAmount > 0,
    },

    {
      label: "On-Chain Storage",
      amount: "< 0.01",
      tokenId: NEAR_TOKEN_DENOM,
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
          {computedTotalFees.map(
            ({
              display = true,
              label,
              amount,
              percentage,
              tokenId = values.tokenId,
            }) =>
              display && (
                <div un-flex="~" un-justify="between" un-gap="4" key={label}>
                  <span className="prose">
                    {label + (percentage ? ` (${percentage}%)` : "")}
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="prose" un-font="600">
                      {amount}
                    </span>

                    <TokenIcon {...{ tokenId }} />
                  </span>
                </div>
              ),
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {protocolFeeRecipientAccountId && (
          <FormField
            control={form.control}
            name="bypassProtocolFee"
            render={({ field }) => (
              <CheckboxField
                checked={field.value}
                onCheckedChange={field.onChange}
                label={
                  <>
                    <span className="prose">{`Remove ${protocolFeePercent}% Protocol Fees`}</span>
                    <ProfileLink accountId={protocolFeeRecipientAccountId} />
                  </>
                }
              />
            )}
          />
        )}

        {values.potAccountId && (
          <FormField
            control={form.control}
            name="bypassProtocolFee"
            render={({ field }) => (
              <CheckboxField
                checked={field.value}
                onCheckedChange={field.onChange}
                label={
                  <>
                    <span className="prose">{`Remove ${chefFeePercent}% Chef Fees`}</span>

                    {values.potAccountId && (
                      <ProfileLink accountId={values.potAccountId} />
                    )}
                  </>
                }
              />
            )}
          />
        )}
      </div>
    </>
  );
};

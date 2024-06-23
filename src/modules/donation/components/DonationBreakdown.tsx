import { UseFormReturn } from "react-hook-form";

import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { TokenIcon } from "@/modules/core";

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
                  <span
                    className="prose line-height-none"
                    un-font="600"
                    un-mt="0.6"
                  >
                    {amount}
                  </span>

                  <TokenIcon {...{ tokenId }} size="small" />
                </span>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

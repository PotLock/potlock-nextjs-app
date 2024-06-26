import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { ByTokenId } from "@/common/types";
import { TextWithIcon } from "@/common/ui/components";
import { TokenIcon } from "@/modules/core";

import { DonationFees } from "../hooks/fees";

export type DonationBreakdownProps = ByTokenId & {
  fees: DonationFees;
};

export const DonationBreakdown: React.FC<DonationBreakdownProps> = ({
  fees: {
    projectAllocationAmount,
    projectAllocationPercent,
    protocolFeeAmount,
    protocolFeePercent,
    referralFeeAmount,
    referralFeePercent,
    chefFeeAmount,
    chefFeePercent,
  },

  ...props
}) => {
  const totalFees = [
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
      amount: referralFeeAmount,
      percentage: referralFeePercent,
      display: referralFeeAmount > 0,
    },

    {
      label: "On-Chain Storage",
      amount: "< 0.01",
      tokenId: NEAR_TOKEN_DENOM,
    },
  ];

  return (
    <div un-flex="~ col" un-gap="2" un-w="full">
      <span className="prose" un-text="neutral-600" un-font="600">
        Breakdown
      </span>

      <div
        un-flex="~ col"
        un-gap="3"
        un-p="4"
        un-border="~ neutral-300 rounded-lg"
      >
        {totalFees.map(
          ({
            display = true,
            label,
            amount,
            percentage,
            tokenId = props.tokenId,
          }) =>
            display && (
              <div un-flex="~" un-justify="between" un-gap="4" key={label}>
                <span className="prose line-height-none" un-mt="0.6">
                  {label + (percentage ? ` (${percentage}%)` : "")}
                </span>

                <TextWithIcon content={amount} className="font-600">
                  <TokenIcon {...{ tokenId }} size="small" />
                </TextWithIcon>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

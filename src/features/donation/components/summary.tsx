import { useMemo } from "react";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import { ByTokenId } from "@/common/types";
import { LabeledIcon } from "@/common/ui/layout/components";
import { TokenIcon } from "@/entities/_shared/token";

import { DonationBreakdown } from "../types";

export type DonationSummaryProps = ByTokenId & {
  data: DonationBreakdown;
};

export const DonationSummary: React.FC<DonationSummaryProps> = ({
  data: {
    projectAllocationAmount,
    projectAllocationPercent,
    protocolFeeAmount,
    protocolFeePercent,
    referralFeeAmount,
    referralFeePercent,
    chefFeeAmount,
    chefFeePercent,
    campaignCreatorFeeAmount,
    campaignCreatorFeePercent,
    storageFeeApproximation,
  },

  ...props
}) => {
  const entries = useMemo(
    () => [
      {
        label: "Project Allocation",
        amount: projectAllocationAmount,
        percentage: projectAllocationPercent,
      },

      {
        label: "Protocol Fee",
        amount: protocolFeeAmount,
        percentage: protocolFeePercent,
        isVisible: protocolFeeAmount > 0,
      },

      {
        label: "Referral Fee",
        amount: referralFeeAmount,
        percentage: referralFeePercent,
        isVisible: referralFeeAmount > 0,
      },

      {
        label: "Chef Fee",
        amount: chefFeeAmount,
        percentage: chefFeePercent,
        isVisible: chefFeeAmount > 0,
      },

      {
        label: "Creator Fee",
        amount: campaignCreatorFeeAmount,
        percentage: campaignCreatorFeePercent,
        isVisible: campaignCreatorFeeAmount > 0,
      },

      {
        label: "On-Chain Storage",
        amount: storageFeeApproximation,
        tokenId: NATIVE_TOKEN_ID,
      },
    ],

    [
      campaignCreatorFeeAmount,
      campaignCreatorFeePercent,
      chefFeeAmount,
      chefFeePercent,
      projectAllocationAmount,
      projectAllocationPercent,
      protocolFeeAmount,
      protocolFeePercent,
      referralFeeAmount,
      referralFeePercent,
      storageFeeApproximation,
    ],
  );

  return (
    <div un-flex="~ col" un-gap="2" un-w="full">
      <span className="prose" un-text="neutral-600" un-font="600">
        {"Breakdown"}
      </span>

      <div className="border-1 flex flex-col gap-3 rounded-lg border-neutral-300 p-4">
        {entries.map(
          ({ isVisible = true, label, amount, percentage, tokenId = props.tokenId }) =>
            isVisible && (
              <div className="flex h-5 items-center justify-between gap-4" key={label}>
                <span className="prose mt-0.6">
                  {label + (percentage ? ` (${percentage}%)` : "")}
                </span>

                <LabeledIcon caption={amount} classNames={{ caption: "font-600" }}>
                  <TokenIcon {...{ tokenId }} size="xs" className="w-5" />
                </LabeledIcon>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

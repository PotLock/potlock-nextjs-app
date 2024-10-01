import { useMemo } from "react";

import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { ByTokenId } from "@/common/types";
import { LabeledIcon } from "@/common/ui/components";
import { TokenIcon } from "@/modules/token";

import { DonationBreakdown } from "../types";

export type DonationGroupAllocationBreakdownProps = {};

export const DonationGroupAllocationBreakdown: React.FC<
  DonationGroupAllocationBreakdownProps
> = () => {
  return <div>WIP</div>;
};

export type DonationSummaryBreakdownProps = ByTokenId & {
  data: DonationBreakdown;
};

export const DonationSummaryBreakdown: React.FC<
  DonationSummaryBreakdownProps
> = ({
  data: {
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
  const entries = useMemo(
    () => [
      {
        label: "Project allocation",
        amount: projectAllocationAmount,
        percentage: projectAllocationPercent,
      },

      {
        label: "Protocol fees",
        amount: protocolFeeAmount,
        percentage: protocolFeePercent,
        isDisplayed: protocolFeeAmount > 0,
      },

      {
        label: "Chef fees",
        amount: chefFeeAmount,
        percentage: chefFeePercent,
        isDisplayed: chefFeeAmount > 0,
      },

      {
        label: "Referral fees",
        amount: referralFeeAmount,
        percentage: referralFeePercent,
        isDisplayed: referralFeeAmount > 0,
      },

      {
        label: "On-Chain Storage",
        amount: "< 0.00001",
        tokenId: NEAR_TOKEN_DENOM,
      },
    ],

    [
      chefFeeAmount,
      chefFeePercent,
      projectAllocationAmount,
      projectAllocationPercent,
      protocolFeeAmount,
      protocolFeePercent,
      referralFeeAmount,
      referralFeePercent,
    ],
  );

  return (
    <div un-flex="~ col" un-gap="2" un-w="full">
      <span className="prose" un-text="neutral-600" un-font="600">
        {"Breakdown"}
      </span>

      <div className="border-1 flex flex-col gap-3 rounded-lg border-neutral-300 p-4">
        {entries.map(
          ({
            isDisplayed = true,
            label,
            amount,
            percentage,
            tokenId = props.tokenId,
          }) =>
            isDisplayed && (
              <div
                className="flex h-5 items-center justify-between gap-4"
                key={label}
              >
                <span className="prose mt-0.6">
                  {label + (percentage ? ` (${percentage}%)` : "")}
                </span>

                <LabeledIcon
                  caption={amount}
                  classNames={{ caption: "font-600" }}
                >
                  <TokenIcon {...{ tokenId }} size="small" />
                </LabeledIcon>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

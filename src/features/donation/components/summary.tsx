import { useMemo } from "react";

import { DEFAULT_STORAGE_FEE_APPROXIMATION, NATIVE_TOKEN_ID } from "@/common/constants";
import { ByTokenId } from "@/common/types";
import { LabeledIcon } from "@/common/ui/layout/components";
import { TokenIcon } from "@/entities/_shared/token";

import type { DonationAllocationBreakdown } from "../hooks/allocation";

export type DonationSummaryProps = ByTokenId & {
  allocation: DonationAllocationBreakdown;
};

export const DonationSummary: React.FC<DonationSummaryProps> = ({
  allocation: { protocolFee, referralFee, curatorFee, curatorTitle, netPercent, netAmount },
  ...props
}) => {
  const entries = useMemo(
    () => [
      {
        label: "Recipient Allocation",
        amount: netAmount,
        percentage: netPercent,
      },

      {
        label: "Protocol Fee",
        percentage: protocolFee.percentage,
        amount: protocolFee.amount,
        isVisible: protocolFee.amount > 0,
      },

      {
        label: "Referrer Fee",
        percentage: referralFee.percentage,
        amount: referralFee.amount,
        isVisible: referralFee.amount > 0,
      },

      {
        label: `${curatorTitle} Fee`,
        percentage: curatorFee.percentage,
        amount: curatorFee.amount,
        isVisible: curatorFee.amount > 0,
      },

      {
        label: "On-Chain Storage",
        amount: DEFAULT_STORAGE_FEE_APPROXIMATION,
        tokenId: NATIVE_TOKEN_ID,
      },
    ],

    [
      curatorFee.amount,
      curatorFee.percentage,
      curatorTitle,
      netAmount,
      netPercent,
      protocolFee.amount,
      protocolFee.percentage,
      referralFee.amount,
      referralFee.percentage,
    ],
  );

  return (
    <div un-flex="~ col" un-gap="2" un-w="full">
      <span className="prose" un-text="neutral-600" un-font="600">
        {"Breakdown"}
      </span>

      <div className="border-1 flex flex-col gap-3 rounded-lg border-neutral-300 p-4">
        {entries.map(
          ({ isVisible = true, label, percentage, amount, tokenId = props.tokenId }) =>
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

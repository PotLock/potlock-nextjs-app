import React, { useMemo } from "react";

import { Big } from "big.js";
import { TimerIcon } from "lucide-react";
import { isNullish } from "remeda";

import type { Campaign } from "@/common/contracts/core/campaigns";
import { indivisibleUnitsToFloat } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import type { ByTokenId } from "@/common/types";
import { Progress } from "@/common/ui/layout/components";
import { TokenIcon, useFungibleToken } from "@/entities/_shared/token";

export type CampaignProgressBarProps = ByTokenId & {
  target: Campaign["target_amount"];
  amount: Campaign["total_raised_amount"];
  minAmount: Campaign["min_amount"];
  endDate?: number;
  isStarted: boolean;
  startDate: number;
  isEscrowBalanceEmpty: boolean;
  isEnded: boolean | string;
};

export const CampaignProgressBar: React.FC<CampaignProgressBarProps> = ({
  tokenId,
  target,
  minAmount,
  amount,
  endDate,
  isEnded,
  isEscrowBalanceEmpty,
  isStarted,
  startDate,
}) => {
  const { data: token } = useFungibleToken({ tokenId });

  const raisedAmountFloat = useMemo(
    () => (token === undefined ? 0 : indivisibleUnitsToFloat(amount, token.metadata.decimals)),
    [amount, token],
  );

  const minAmountFloat = useMemo(
    () =>
      token === undefined || isNullish(minAmount)
        ? 0
        : indivisibleUnitsToFloat(minAmount, token.metadata.decimals),

    [minAmount, token],
  );

  const targetAmountFloat = useMemo(
    () => (token === undefined ? 0 : indivisibleUnitsToFloat(target, token.metadata.decimals)),
    [target, token],
  );

  const isTargetMet = useMemo(
    () => raisedAmountFloat !== 0 && raisedAmountFloat >= targetAmountFloat,
    [raisedAmountFloat, targetAmountFloat],
  );

  const progressPercentage = useMemo(
    () =>
      Math.min(
        100,
        Math.floor(
          Big(raisedAmountFloat)
            .div(targetAmountFloat || 1)
            .mul(100)
            .toNumber(),
        ),
      ),

    [raisedAmountFloat, targetAmountFloat],
  );

  const color = useMemo(() => {
    if (isTargetMet) {
      return "#7FC41E";
    } else if (raisedAmountFloat < minAmountFloat) {
      return "#DD3345";
    } else {
      return "#ECC113";
    }
  }, [raisedAmountFloat, minAmountFloat, isTargetMet]);

  const baseColor = useMemo(() => {
    if (isTargetMet) {
      return "#E6F7E0";
    } else if (raisedAmountFloat < minAmountFloat) {
      return "#FEE6E5";
    } else {
      return "#FDF4D9";
    }
  }, [raisedAmountFloat, minAmountFloat, isTargetMet]);

  const minArrowColor = useMemo(() => {
    if (isTargetMet) {
      return "#7FC41E";
    } else if (raisedAmountFloat < minAmountFloat) {
      return "#FEE6E5";
    } else {
      return "#ECC113";
    }
  }, [raisedAmountFloat, minAmountFloat, isTargetMet]);

  const timeLeft = endDate ? getTimePassed(endDate, false, true) : null;
  const isTimeUp = timeLeft?.includes("-");

  const statusText = useMemo(() => {
    if (isEnded && endDate) {
      return endDate ? `ENDED (${getTimePassed(endDate, false)} ago)` : "ENDED";
    } else if (isStarted) {
      return `Starts in ${getTimePassed(startDate, false, true)}`;
    } else if (timeLeft) {
      return `${timeLeft} left`;
    } else {
      return "ONGOING";
    }
  }, [isEnded, endDate, isStarted, timeLeft, startDate]);

  const amountDisplay = useMemo(
    () => (
      <div className="inline-flex items-center gap-1 text-sm">
        <TokenIcon tokenId={tokenId} />
        <span>{raisedAmountFloat}</span>

        <span className="m-0 p-0 pl-1 text-sm font-medium text-[#7B7B7B]">
          {`/ ${targetAmountFloat} ${token?.metadata.symbol ?? ""}`}
        </span>
      </div>
    ),
    [raisedAmountFloat, targetAmountFloat, token?.metadata.symbol, tokenId],
  );

  const titleContent = useMemo(() => {
    if (isEnded) {
      let message;

      if (raisedAmountFloat && !isTargetMet && raisedAmountFloat < minAmountFloat) {
        message = isEscrowBalanceEmpty ? "Refunds Processed" : "Refunds Pending";
      } else if (raisedAmountFloat && (isTargetMet || raisedAmountFloat > minAmountFloat)) {
        message = isEscrowBalanceEmpty ? "Payout Processed" : "Payout Pending";
      } else {
        message = "Goal Not Reached";
      }

      const messageColor = (() => {
        if (raisedAmountFloat < minAmountFloat && !isEscrowBalanceEmpty) {
          return "#DD3345";
        } else if (isTargetMet || raisedAmountFloat > minAmountFloat) {
          return color;
        } else {
          return "#DD3345";
        }
      })();

      return (
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: messageColor }}>
            {message}
          </span>
          {amountDisplay}
        </div>
      );
    } else if (isTargetMet) {
      return (
        <div className="flex w-full items-center">
          <span className="text-sm font-semibold text-[#7FC41E]">Goal Achieved</span>
          {amountDisplay}
        </div>
      );
    } else {
      return (
        <span className="inline-flex items-center justify-center gap-1">
          <TokenIcon tokenId={tokenId} />
          {raisedAmountFloat}

          <span className="m-0 p-0 pl-1 font-medium text-[#7B7B7B]">
            {`/ ${targetAmountFloat} ${token?.metadata.symbol ?? ""} Raised`}
          </span>
        </span>
      );
    }
  }, [
    amountDisplay,
    isTimeUp,
    isTargetMet,
    raisedAmountFloat,
    minAmountFloat,
    isEscrowBalanceEmpty,
    color,
    tokenId,
    targetAmountFloat,
    token?.metadata.symbol,
  ]);

  return (
    <div className="flex w-full flex-col">
      <p className="mb-2 flex items-center font-semibold">{titleContent}</p>

      <div className="h-12 w-full">
        <Progress
          minArrowColor={minArrowColor}
          baseColor={baseColor}
          minAmount={`${minAmountFloat} ${token?.metadata.symbol ?? ""}`}
          minValuePercentage={
            minAmountFloat
              ? Math.floor(
                  Big(minAmountFloat)
                    .div(targetAmountFloat || 1)
                    .mul(100)
                    .toNumber(),
                )
              : undefined
          }
          value={progressPercentage}
          bgColor={color}
        />
      </div>

      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <TimerIcon size={20} className="text-[#7B7B7B]" />

          <p className="m-0 p-0 pt-[4px] text-[14px] text-sm font-semibold text-[#292929]">
            {statusText}
          </p>
        </div>

        <div>
          <p className="font-semibold" style={{ color }}>
            {progressPercentage}%
          </p>
        </div>
      </div>
    </div>
  );
};

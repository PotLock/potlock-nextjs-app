import React, { useMemo } from "react";

import { Big } from "big.js";
import { TimerIcon } from "lucide-react";
import { isNullish } from "remeda";

import type { Campaign } from "@/common/contracts/core/campaigns";
import { indivisibleUnitsToFloat } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import type { ByTokenId } from "@/common/types";
import { Progress } from "@/common/ui/layout/components";
import { NearIcon } from "@/common/ui/layout/svg";
import { useToken } from "@/entities/_shared";

export type CampaignProgressBarProps = ByTokenId & {
  target: Campaign["target_amount"];
  amount: Campaign["total_raised_amount"];
  minAmount: Campaign["min_amount"];
  endDate?: number;
  isStarted: boolean;
  startDate: number;
  isEscrowBalanceEmpty: boolean;
};

export const CampaignProgressBar: React.FC<CampaignProgressBarProps> = ({
  tokenId,
  target,
  minAmount,
  amount,
  endDate,
  isEscrowBalanceEmpty,
  isStarted,
  startDate,
}) => {
  const { isLoading: isTokenDataLoading, data: token } = useToken({ tokenId });

  const raisedAmountFloat = useMemo(
    () => (token === undefined ? 0 : indivisibleUnitsToFloat(amount, token.metadata.decimals)),
    [amount, token],
  );

  const minAmountFLoat = useMemo(
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
    } else if (raisedAmountFloat < minAmountFLoat) {
      return "#DD3345";
    } else {
      return "#ECC113";
    }
  }, [raisedAmountFloat, minAmountFLoat, isTargetMet]);

  const baseColor = useMemo(() => {
    if (isTargetMet) {
      return "#E6F7E0";
    } else if (raisedAmountFloat < minAmountFLoat) {
      return "#FEE6E5";
    } else {
      return "#FDF4D9";
    }
  }, [raisedAmountFloat, minAmountFLoat, isTargetMet]);

  const minArrowColor = useMemo(() => {
    if (isTargetMet) {
      return "#7FC41E";
    } else if (raisedAmountFloat < minAmountFLoat) {
      return "#FEE6E5";
    } else {
      return "#ECC113";
    }
  }, [raisedAmountFloat, minAmountFLoat, isTargetMet]);

  const timeLeft = endDate ? getTimePassed(endDate, false, true) : null;
  const isTimeUp = timeLeft?.includes("-");

  const statusText = useMemo(() => {
    if ((isTargetMet && endDate && endDate < Date.now()) || isTimeUp) {
      return endDate ? `ENDED (${getTimePassed(endDate, false)} ago)` : "ENDED";
    } else if (isStarted) {
      return `Starts in ${getTimePassed(startDate, false, true)}`;
    } else if (timeLeft) {
      return `${timeLeft} left`;
    } else {
      return "ONGOING";
    }
  }, [isTargetMet, endDate, isTimeUp, isStarted, timeLeft, startDate]);

  const nearDisplay = useMemo(
    () => (
      <div className="inline-flex gap-1 text-sm">
        <NearIcon className="m-0 mt-[2px] h-4 w-4" />
        {raisedAmountFloat}
        <span className="m-0 p-0 pl-1 text-sm font-medium text-[#7B7B7B]">
          / {targetAmountFloat} NEAR
        </span>
      </div>
    ),
    [raisedAmountFloat, targetAmountFloat],
  );

  const titleContent = useMemo(() => {
    if (isTimeUp) {
      let message;

      if (raisedAmountFloat && !isTargetMet && raisedAmountFloat < minAmountFLoat) {
        message = isEscrowBalanceEmpty ? "Refunds Processed" : "Refunds Pending";
      } else if (raisedAmountFloat && (isTargetMet || raisedAmountFloat > minAmountFLoat)) {
        message = isEscrowBalanceEmpty ? "Payout Processed" : "Payout Pending";
      } else {
        message = "Goal Not Reached";
      }

      const messageColor = (() => {
        if (raisedAmountFloat < minAmountFLoat && !isEscrowBalanceEmpty) {
          return "#DD3345";
        } else if (isTargetMet || raisedAmountFloat > minAmountFLoat) {
          return color;
        } else {
          return "#DD3345";
        }
      })();

      return (
        <div className="flex w-full items-center justify-between">
          <span className={`text-sm font-semibold text-[${messageColor}]`}>{message}</span>
          {nearDisplay}
        </div>
      );
    } else if (isTargetMet) {
      return (
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-semibold text-[#7FC41E]">Goal Achieved</span>
          {nearDisplay}
        </div>
      );
    } else {
      return (
        <>
          <NearIcon className="m-0 mr-1 h-4 w-4" />
          {raisedAmountFloat}{" "}
          <span className="m-0 p-0 pl-1 font-medium text-[#7B7B7B]">
            {" "}
            / {targetAmountFloat} NEAR Raised
          </span>
        </>
      );
    }
  }, [
    isTimeUp,
    isTargetMet,
    raisedAmountFloat,
    minAmountFLoat,
    nearDisplay,
    isEscrowBalanceEmpty,
    color,
    targetAmountFloat,
  ]);

  return (
    <div className="flex w-full flex-col">
      <p className="mb-2 flex items-center font-semibold">{titleContent}</p>

      <div className="h-12 w-full">
        <Progress
          minArrowColor={minArrowColor}
          baseColor={baseColor}
          minAmount={`${minAmountFLoat} NEAR`}
          minValuePercentage={
            minAmountFLoat
              ? Math.floor(
                  Big(minAmountFLoat)
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

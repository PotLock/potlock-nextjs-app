import React, { useMemo } from "react";

import { Big } from "big.js";
import { TimerIcon } from "lucide-react";

import getTimePassed from "@/common/lib/getTimePassed";
import { Progress } from "@/common/ui/layout/components";
import { NearIcon } from "@/common/ui/layout/svg";

type CampaignProgressBarProps = {
  target: number;
  amount: number;
  minAmount: number;
  endDate?: number;
  isStarted: boolean;
  targetMet: boolean;
  isEscrowBalanceEmpty: boolean;
};

export const CampaignProgressBar: React.FC<CampaignProgressBarProps> = ({
  target,
  minAmount,
  amount,
  endDate,
  isEscrowBalanceEmpty,
  targetMet,
  isStarted,
}) => {
  const progressPercentage = Math.min(100, Math.floor(Big(amount).div(target).mul(100).toNumber()));

  const color = (() => {
    if (targetMet) {
      return "#7FC41E";
    } else if (amount < minAmount) {
      return "#DD3345";
    } else {
      return "#ECC113";
    }
  })();

  const baseColor = (() => {
    if (targetMet) {
      return "#E6F7E0";
    } else if (amount < minAmount) {
      return "#FEE6E5";
    } else {
      return "#FDF4D9";
    }
  })();

  const minArrowColor = (() => {
    if (targetMet) {
      return "#7FC41E";
    } else if (amount < minAmount) {
      return "#FEE6E5";
    } else {
      return "#ECC113";
    }
  })();

  const timeLeft = endDate ? getTimePassed(endDate, false, true) : null;
  const isTimeUp = timeLeft?.includes("-");

  const statusText = useMemo(() => {
    if ((targetMet && endDate) || isTimeUp) {
      return endDate ? `ENDED (${getTimePassed(endDate, false)} ago)` : "ENDED";
    } else if (isStarted) {
      return "NOT STARTED";
    } else if (timeLeft) {
      return `${timeLeft} left`;
    } else {
      return "ONGOING";
    }
  }, [targetMet, isTimeUp, isStarted, timeLeft]);

  const nearDisplay = useMemo(
    () => (
      <div className="inline-flex gap-1 text-sm">
        <NearIcon className="m-0 mt-[2px] h-4 w-4" />
        {amount}
        <span className="m-0 p-0 pl-1 text-sm font-medium text-[#7B7B7B]">/ {target} NEAR</span>
      </div>
    ),
    [amount, target],
  );

  const titleContent = useMemo(() => {
    if (isTimeUp) {
      let message;

      if (amount && !targetMet && amount < minAmount) {
        message = isEscrowBalanceEmpty
          ? "Donations have been refunded"
          : "Donations are yet to be refunded";
      } else if (amount && (targetMet || amount > minAmount)) {
        message = isEscrowBalanceEmpty
          ? "Donations have been paid out"
          : "Donations are yet to be paid out";
      } else {
        message = "Goal was not Achieved";
      }

      const messageColor = (() => {
        if (amount < minAmount && !isEscrowBalanceEmpty) {
          return "#DD3345";
        } else if (targetMet || amount > minAmount) {
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
    } else if (targetMet) {
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
          {amount}{" "}
          <span className="m-0 p-0 pl-1 font-medium text-[#7B7B7B]"> / {target} NEAR Raised</span>
        </>
      );
    }
  }, [isTimeUp, amount, targetMet, minAmount, isEscrowBalanceEmpty, color, nearDisplay]);

  return (
    <div className="flex w-full flex-col">
      <p className="mb-2 flex items-center font-semibold">{titleContent}</p>
      <div className="h-12 w-full">
        <Progress
          minArrowColor={minArrowColor}
          baseColor={baseColor}
          minAmount={`${minAmount} NEAR`}
          minValuePercentage={
            minAmount ? Math.floor(Big(minAmount).div(target).mul(100).toNumber()) : undefined
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

import React from "react";

import { Big } from "big.js";
import { TimerIcon } from "lucide-react";

import getTimePassed from "@/common/lib/getTimePassed";
import { Progress } from "@/common/ui/components/atoms/progress";
import { NearIcon } from "@/common/ui/svg";

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

  const color = targetMet ? "#7FC41E" : amount < minAmount ? "#DD3345" : "#ECC113";

  const timeLeft = endDate ? getTimePassed(endDate, false, true) : null;
  const isTimeUp = timeLeft?.includes("-");

  let statusText;

  if (targetMet || isTimeUp) {
    statusText = "ENDED";
  } else if (isStarted) {
    statusText = "NOT STARTED";
  } else if (timeLeft) {
    statusText = `${timeLeft} left`;
  } else {
    statusText = "ONGOING";
  }

  return (
    <div className="flex w-full flex-col">
      <p className="mb-2 flex items-center font-semibold">
        {isTimeUp ? (
          <div className="flex w-full justify-between">
            <div>
              {amount && isTimeUp && !targetMet && amount < minAmount ? (
                <span className="text-sm font-semibold text-[#DD3345]">
                  {isEscrowBalanceEmpty
                    ? "Donations have been refunded"
                    : "Donations are yet to be refunded"}
                </span>
              ) : amount && (targetMet || amount > minAmount) && isTimeUp ? (
                <span style={{ color }} className="text-sm font-semibold">
                  {isEscrowBalanceEmpty
                    ? "Donations have been paid out"
                    : "Donations are yet to be paid out"}
                </span>
              ) : (
                <span className="text-sm font-semibold text-[#DD3345]">
                  {"Goal was not Achieved"}
                </span>
              )}
            </div>
            <div className="inline-flex gap-1 text-sm">
              <NearIcon className="m-0 mt-[2px] h-4 w-4" />
              {amount}
              <span className="m-0 p-0 pl-1 text-sm font-medium text-[#7B7B7B]">
                {" "}
                / {target} NEAR
              </span>
            </div>
          </div>
        ) : targetMet ? (
          <div className="flex w-full justify-between">
            <span className="text-sm font-semibold text-[#7FC41E]">Goal Achieved</span>
            <div className="inline-flex gap-1 text-sm">
              <NearIcon className="m-0  mt-[2px] h-4 w-4" />
              {amount}
              <span className="m-0 p-0 pl-1 text-sm font-medium text-[#7B7B7B]">
                {" "}
                / {target} NEAR
              </span>
            </div>
          </div>
        ) : (
          <>
            <NearIcon className="m-0 mr-1 h-4 w-4" />
            {amount}{" "}
            <span className="m-0 p-0 pl-1 font-medium text-[#7B7B7B]"> / {target} NEAR Raised</span>
          </>
        )}
      </p>
      <Progress value={progressPercentage} bgColor={color} />
      <div className="mt-4 flex justify-between">
        <div className="flex items-center gap-1">
          <TimerIcon size={20} className="text-[#7B7B7B]" />
          <p className="m-0 p-0 pt-[4px] text-[14px] font-semibold text-[#292929]">{statusText}</p>
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

import React from "react";

import { TimerIcon } from "lucide-react";

import getTimePassed from "@/common/lib/getTimePassed";
import { Progress } from "@/common/ui/components/progress";

type CampaignProgressBarProps = {
  target: number;
  amount: number;
  minAmount: number;
  endDate?: number;
  isStarted: boolean;
  targetMet: boolean;
};

export const CampaignProgressBar: React.FC<CampaignProgressBarProps> = ({
  target,
  minAmount,
  amount,
  endDate,
  targetMet,
  isStarted,
}) => {
  const color =
    amount >= target
      ? "#7FC41E"
      : amount < minAmount
        ? "#DD3345"
        : amount === target
          ? "#7FC41E"
          : "#ECC113";
  const value = amount >= target ? 100 : Math.floor((amount / target) * 100);

  const getDaysLeft = endDate ? getTimePassed(endDate, false, true) : null;
  return (
    <div className="flex w-full flex-col">
      {targetMet ? (
        <p className="mb-2 font-semibold">Goal Met</p>
      ) : target > amount ? (
        <p className="mb-2 font-semibold">
          {target - amount} NEAR{" "}
          <span className="font-semibold text-[#7B7B7B]">
            Left to meet goal
          </span>
        </p>
      ) : (
        <p className="mb-2 font-semibold">
          {amount - target} NEAR
          <span className="font-semibold text-[#7B7B7B]"> Above goal</span>
        </p>
      )}
      <Progress value={value} bgColor={color} />
      <div className="mt-4 flex justify-between">
        <div className="flex items-center gap-1">
          <TimerIcon size={20} className="text-[#7B7B7B]" />
          <p className="m-0 p-0 pt-[4px] text-[14px] font-semibold text-[#292929]">
            {targetMet
              ? "ENDED"
              : !isStarted
                ? getDaysLeft
                  ? `${getDaysLeft ? getDaysLeft : "0"} left`
                  : "ONGOING"
                : "NOT STARTED"}
          </p>
        </div>
        <div>
          <p className="font-semibold" style={{ color }}>
            {value}%
          </p>
        </div>
      </div>
    </div>
  );
};

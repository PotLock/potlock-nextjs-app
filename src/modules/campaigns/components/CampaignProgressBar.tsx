import React from "react";

import { TimerIcon } from "lucide-react";

import { Progress } from "@/common/ui/components/progress";

type CampaignProgressBarProps = {
  target: number;
  amount: number;
  minAmount: number;
};

export const CampaignProgressBar: React.FC<CampaignProgressBarProps> = ({
  target,
  minAmount,
  amount,
}) => {
  const color =
    amount < minAmount ? "#DD3345" : amount === target ? "#7FC41E" : "#ECC113";
  const value = amount >= target ? 100 : Math.floor((amount / target) * 100);
  return (
    <div className="flex w-full flex-col">
      <p className="mb-2 font-semibold">
        {target - amount} NEAR{" "}
        <span className="font-semibold text-[#7B7B7B]">Left to meet goal</span>
      </p>
      <Progress value={value} bgColor={color} />
      <div className="mt-4 flex justify-between">
        <div className="flex items-center gap-1">
          <TimerIcon size={20} className="text-[#7B7B7B]" />
          <p className="tex-[14px] m-0 p-0  text-[#292929]">4 days left</p>
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

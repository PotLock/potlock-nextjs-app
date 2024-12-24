import { cn } from "@/common/ui/utils";

interface WeightBoostItem {
  icon: React.ReactNode;
  label: string;
  isCurrentStage?: boolean;
  percentage: number;
  verified?: boolean;
}

export const VotingWeightBoostBadge = ({ data }: { data: WeightBoostItem }) => (
  <div
    className={cn(
      "inline-flex items-center gap-2 rounded-md border px-2 py-1 shadow-inner",

      {
        "border-[#f8d3b0] bg-[#fef6ee] text-[#b63d18]": data.verified,
        "border-[#dadada] bg-[#f7f7f7] text-[#7b7b7b]": !data.verified,
      },
    )}
  >
    {data.icon}
    <div>
      {data.verified && data.isCurrentStage && (
        <span className="pr-1 text-sm font-normal text-inherit">{data.label}</span>
      )}
      <span className="text-sm font-normal text-inherit">x{data.percentage}%</span>
    </div>
  </div>
);

import { MdOutlineTimer } from "react-icons/md";

import { AccountProfilePicture } from "@/entities/account";

import { VotingWeightBoostBadge } from "./badges";

interface WeightBoostItem {
  icon: React.ReactNode;
  label: string;
  isCurrentStage?: boolean;
  percentage: number;
  verified?: boolean;
}

interface WeightBoostData {
  total: number;
  items: WeightBoostItem[];
}

export type VotingHistoryEntryProps = {
  id: string;
  username: string;
  votedFor: string;
  timestamp: string;
  weightBoost: WeightBoostData;
};

export const VotingHistoryEntry: React.FC<VotingHistoryEntryProps> = ({
  username,
  votedFor,
  timestamp,
  weightBoost,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border p-5">
      <div className="flex items-center gap-4">
        <AccountProfilePicture accountId={username} className="h-12 w-12" />

        <div className="flex flex-col">
          <span className="text-[17px] font-semibold text-[#292929]">{username}</span>

          <div className="flex items-center gap-1">
            <span className="text-[17px] font-normal text-[#292929]">Voted</span>
            <AccountProfilePicture accountId={username} className="h-6 w-6" />
            <span className="text-[17px] font-semibold text-[#292929]">{votedFor}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex flex-col flex-wrap items-start justify-start gap-3 md:flex-row md:items-center">
          {weightBoost.items.map((item, index) => (
            <VotingWeightBoostBadge key={index} data={item} />
          ))}
        </div>
      </div>

      <div className="inline-flex">
        <MdOutlineTimer className="h-6 w-6 px-[3px] text-[#7a7a7a]" />
        <span className="text-center text-[17px] font-normal text-[#7a7a7a]">{timestamp}</span>
      </div>
    </div>
  );
};

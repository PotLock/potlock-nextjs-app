import { MdOutlineTimer } from "react-icons/md";

import type { Vote } from "@/common/contracts/core/voting";
import { AccountHandle, AccountProfileLink, AccountProfilePicture } from "@/entities/account";

import { VotingWeightBoostBadge } from "./badges";

export type VotingHistoryEntryProps = {
  data: Vote;
};

export const VotingHistoryEntry: React.FC<VotingHistoryEntryProps> = ({
  data: {
    candidate_id: candidateAccountId,
    voter: voterAccountId,
    weight: voterBasicVoteWeight,
    timestamp,
  },
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border p-5">
      <div className="flex items-center gap-4">
        <AccountProfilePicture accountId={voterAccountId} className="h-12 w-12" />

        <div className="flex flex-col">
          <AccountHandle accountId={voterAccountId} />

          <div className="flex items-center gap-1">
            <span className="text-[17px] font-normal">{"Voted for"}</span>
            <AccountProfileLink accountId={candidateAccountId} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex flex-col flex-wrap items-start justify-start gap-3 md:flex-row md:items-center">
          {/* {weightBoost.items.map((item, index) => (
            <VotingWeightBoostBadge key={index} data={item} />
          ))} */}
        </div>
      </div>

      <div className="inline-flex">
        <MdOutlineTimer className="h-6 w-6 px-[3px] text-[#7a7a7a]" />
        <span className="text-center text-[17px] font-normal text-[#7a7a7a]">{timestamp}</span>
      </div>
    </div>
  );
};

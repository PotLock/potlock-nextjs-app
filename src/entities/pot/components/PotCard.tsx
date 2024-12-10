import Link from "next/link";

import { ByPotId, indexer } from "@/common/api/indexer";
import routesPath from "@/pathnames";

import { Indicator } from "./Indicator";
import { PotTag } from "./PotTag";
import { usePotTags } from "../hooks/tags";
import { useNearAndUsdByPot } from "../hooks/useNearAndUsdByPot";

export type PotCardProps = ByPotId & {};

export const PotCard: React.FC<PotCardProps> = ({ potId }) => {
  const { data: pot, isLoading: isPotLoading } = indexer.usePot({ potId });
  const { amountNear, amountUsd } = useNearAndUsdByPot({ pot });
  const tags = usePotTags({ potId });

  return !pot ? (
    // Card
    <div className="flex h-full min-h-[300px] min-w-[320px] max-w-[393px] flex-col items-center justify-center rounded-[8px] bg-white pb-1.5 shadow-[inset_0px_-2px_0px_0px_#464646,0px_0px_0px_1px_#464646] hover:cursor-pointer">
      {pot === undefined && !isPotLoading ? (
        <div>{`Pot ${potId} not found.`}</div>
      ) : (
        <div className="spinner-border text-secondary" role="status" />
      )}
    </div>
  ) : (
    // Card
    <Link
      href={`${routesPath.pot}/${pot.account}`}
      className="flex h-full min-h-[300px] min-w-[320px] max-w-[393px] flex-col rounded-[8px] bg-white pb-1.5 shadow-[inset_0px_-2px_0px_0px_#464646,0px_0px_0px_1px_#464646] hover:cursor-pointer hover:no-underline"
    >
      {/* Card Section */}
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 p-8">
        {/* Title */}
        <h2 className="break-words text-[22px] font-semibold leading-[28px] text-[#292929]">
          {pot.name}
        </h2>
        <p className="markdown-link break-words text-[16px] font-normal leading-[28px] text-[#525252]">
          {pot.description}
        </p>
      </div>
      {/* Card Section */}
      <div className="mt-auto flex h-fit h-full w-full flex-col items-start justify-start gap-4 border-t border-[#7B7B7B] bg-[#f6f5f3] p-8">
        {/* Title */}
        <h2 className="flex items-baseline break-words text-[22px] font-semibold leading-[28px] text-[#292929]">
          {amountNear}
          <span className="ml-1 text-[14px] font-normal">{amountUsd}</span>
          <span className="ml-2 text-[14px] text-[#7b7b7b]">in pot</span>
        </h2>
        {tags.map(
          (tag) =>
            tag.visibility && (
              <PotTag
                backgroundColor={tag.backgroundColor}
                borderColor={tag.borderColor}
                textColor={tag.textColor}
                text={tag.text}
                preElements={<Indicator {...(tag.preElementsProps || {})} />}
                key={tag.text}
              />
            ),
        )}
      </div>
    </Link>
  );
};

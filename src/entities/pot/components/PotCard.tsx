import { useMemo } from "react";

import { Big } from "big.js";
import Link from "next/link";

import { ByPotId, Pot, indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { formatWithCommas } from "@/common/lib";
import { tokenHooks } from "@/common/services/token";
import routesPath from "@/pathnames";

import { Indicator } from "./Indicator";
import { PotTag } from "./PotTag";
import { usePotTags } from "../hooks/tags";

/**
 * @deprecated Use `yoctoNearToFloat`
 */
const yoctoNearToNear = (amountYoctoNear: string, abbreviate?: boolean) => {
  return formatWithCommas(Big(amountYoctoNear).div(1e24).toFixed(2)) + (abbreviate ? "N" : " NEAR");
};

/**
 * @deprecated use `tokenHooks` capabilities.
 */
export const useMatchingPoolBalance = ({ pot }: { pot?: Pot }) => {
  const { data: nearToken } = tokenHooks.useToken({ tokenId: NATIVE_TOKEN_ID });

  return useMemo(() => {
    if (pot) {
      return {
        amountUsd: nearToken?.usdPrice
          ? "~$" +
            formatWithCommas(
              nearToken?.usdPrice?.mul(pot.matching_pool_balance).div(1e24).toFixed(2),
            )
          : "-",

        amountNear: yoctoNearToNear(pot.matching_pool_balance, true),
      };
    } else return { amountUsd: "...", amountNear: "..." };
  }, [nearToken?.usdPrice, pot]);
};

export type PotCardProps = ByPotId & {};

export const PotCard: React.FC<PotCardProps> = ({ potId }) => {
  const { data: pot, isLoading: isPotLoading } = indexer.usePot({ potId });
  const { amountNear, amountUsd } = useMatchingPoolBalance({ pot });
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

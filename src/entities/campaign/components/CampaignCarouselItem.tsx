import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import { Campaign } from "@/common/contracts/core/campaigns";
import { truncate } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import { CarouselItem } from "@/common/ui/layout/components";
import { AccountProfileLink } from "@/entities/_shared/account";
import { DonateToCampaign } from "@/features/donation";

import { CampaignProgressBar } from "./CampaignProgressBar";

export const CampaignCarouselItem = ({ data }: { data: Campaign }) => {
  const isStarted = getTimePassed(Number(data.start_ms), true)?.includes("-");

  const isEnded = data?.end_ms
    ? getTimePassed(Number(data?.end_ms), false, true)?.includes("-")
    : false;

  return (
    <CarouselItem key={data.id}>
      <Link
        className="flex w-full flex-col items-start justify-between gap-4 md:flex-row"
        href={`/campaign/${data.id}/leaderboard`}
        passHref
      >
        <div className="h-293px relative md:h-[285px] md:w-[68%] md:rounded-xl">
          <LazyLoadImage
            src={data?.cover_image_url || "/assets/images/list-gradient-3.png"}
            alt=""
            className="inset-1 h-full w-full object-cover md:rounded-xl"
            width={500}
            height={300}
          />
          <div className="absolute inset-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-70 md:rounded-xl"></div>{" "}
          <div className="absolute bottom-0 z-40 flex flex-col items-start gap-2 p-4">
            <h1 className="text-[24px] font-bold text-white">{data.name}</h1>
            <div className="m-0 flex flex-col items-start gap-2 p-0 text-[12px] text-white md:flex-row md:items-center md:text-[15px]">
              <div className="flex gap-1">
                <p className="font-semibold">FOR</p>
                <AccountProfileLink accountId={data.recipient as string} />
              </div>
              <div className="hidden flex-col items-center bg-gray-800 md:flex">
                <span className="bg-background h-[18px] w-[2px] text-white" />{" "}
              </div>
              <div className="flex gap-1">
                <p className="font-semibold">ORGANIZED BY</p>
                <AccountProfileLink accountId={data.owner as string} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start p-4 md:w-[28%] md:p-0">
          <CampaignProgressBar
            tokenId={data.ft_id ?? NATIVE_TOKEN_ID}
            amount={data?.total_raised_amount ?? `${0}`}
            minAmount={data?.min_amount ?? `${0}`}
            target={data?.target_amount ?? `${0}`}
            isStarted={isStarted}
            isEscrowBalanceEmpty={data?.escrow_balance === "0"}
            startDate={data?.start_ms}
            endDate={Number(data?.end_ms)}
          />
          <p className="mt-4 text-start md:h-28">
            {data?.description ? truncate(data.description, 100) : ""}
          </p>
          <DonateToCampaign
            cachedTokenId={data.ft_id ?? NATIVE_TOKEN_ID}
            campaignId={data.id}
            className="mt-4"
            disabled={isStarted || isEnded || data?.total_raised_amount === data?.max_amount}
          />
        </div>
      </Link>
    </CarouselItem>
  );
};

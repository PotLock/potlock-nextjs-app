import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { Campaign } from "@/common/contracts/core/campaigns";
import { truncate, yoctoNearToFloat } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import { BadgeIcon } from "@/common/ui/layout/svg/BadgeIcon";
import { cn } from "@/common/ui/layout/utils";
import { AccountProfileLink } from "@/entities/_shared/account";
import { DonateToCampaignProjects } from "@/features/donation";

import { CampaignProgressBar } from "./CampaignProgressBar";

export const CampaignCard = ({ data }: { data: Campaign }) => {
  const isStarted = getTimePassed(Number(data.start_ms), true)?.includes("-");

  const isEnded = data?.end_ms
    ? getTimePassed(Number(data?.end_ms), false, true)?.includes("-")
    : false;

  return (
    <div
      className={cn(
        "h-144 cursor-pointer rounded-lg  ease-in-out ",
        "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_2px_2px_-1px_rgba(5,5,5,0.08),0px_3px_5px_0px_rgba(5,5,5,0.08)] ",
        "transition-all duration-500 hover:shadow-[0_6px_10px_rgba(0,0,0,0.2)]",
      )}
    >
      <Link href={`/campaign/${data.id}`} passHref>
        <div className="relative h-[212px] w-full">
          <LazyLoadImage
            src={data?.cover_image_url || "/assets/images/list-gradient-3.png"}
            alt=""
            className="h-52 w-full rounded-t-lg object-cover hover:scale-150"
            width={500}
            height={500}
          />
          <div className="absolute inset-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>{" "}
          <h1 className="absolute bottom-0 px-6 py-3 text-[20px] font-semibold text-white">
            {data.name}
          </h1>
          {data?.owner === data?.recipient && (
            <div className="absolute right-2 top-2 flex  items-center gap-1">
              <BadgeIcon size={5} />
              <span className="m-0 font-bold text-white">OFFICIAL</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 px-6 py-6">
          <div className="flex gap-0 font-semibold">
            <p className="mr-2 font-semibold text-[#656565]">FOR</p>
            <div onClick={(e) => e.stopPropagation()}>
              <AccountProfileLink
                classNames={{ root: "bg-transparent", avatar: "h-5 w-5", name: "text-sm" }}
                accountId={data.recipient}
              />
            </div>
          </div>

          <div className="h-[110px]">
            <p className="text-[16px]">{data.description ? truncate(data.description, 160) : ""}</p>
          </div>
          <CampaignProgressBar
            startDate={Number(data?.start_ms)}
            target={data?.target_amount ? yoctoNearToFloat(data?.target_amount) : 0}
            minAmount={data?.min_amount ? yoctoNearToFloat(data?.min_amount) : 0}
            targetMet={
              yoctoNearToFloat(data?.total_raised_amount) >= yoctoNearToFloat(data?.target_amount)
            }
            isStarted={isStarted}
            isEscrowBalanceEmpty={data?.escrow_balance === "0"}
            amount={data?.total_raised_amount ? yoctoNearToFloat(data?.total_raised_amount) : 0}
            endDate={Number(data?.end_ms)}
          />
          <DonateToCampaignProjects
            campaignId={data.id}
            variant="standard-outline"
            disabled={isStarted || isEnded || data?.total_raised_amount === data?.max_amount}
          />
        </div>
      </Link>
    </div>
  );
};

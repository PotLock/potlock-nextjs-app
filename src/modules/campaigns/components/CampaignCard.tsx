import Image from "next/image";
import Link from "next/link";

import { Campaign } from "@/common/contracts/potlock";
import { truncate, yoctoNearToFloat } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import { AccountProfilePicture } from "@/modules/core";
import { DonateToCampaignProjects } from "@/modules/donation";

import { CampaignProgressBar } from "./CampaignProgressBar";

export const CampaignCard = ({ data }: { data: Campaign }) => {
  const isStarted = getTimePassed(Number(data.start_ms), true)?.includes("-");

  return (
    <div className="md:w-104 h-144  w-full cursor-pointer rounded-lg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_2px_2px_-1px_rgba(5,5,5,0.08),0px_3px_5px_0px_rgba(5,5,5,0.08)] transition-all duration-500 ease-in-out hover:shadow-[0_6px_10px_rgba(0,0,0,0.2)]">
      <Link href={`/campaign/${data.id}/leaderboard`} passHref>
        <div className="relative h-[212px] w-full">
          <Image
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
        </div>
        <div className="flex flex-col gap-4 px-6 py-6">
          <div className="flex gap-0 font-semibold">
            <p className="mr-2 font-semibold text-[#656565]">FOR</p>
            <Link target="_blank" href={`/profile/${data.recipient}`}>
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 transition-all  duration-300 hover:opacity-50"
              >
                <AccountProfilePicture
                  className="h-4 w-4"
                  accountId={data.recipient}
                />
                <p className="m-0 font-semibold text-[#656565]">
                  {data.recipient}
                </p>
              </div>
            </Link>
          </div>
          <div className="h-[120px]">
            <p className="text-[16px]">
              {data.description ? truncate(data.description, 200) : ""}
            </p>
          </div>
          <CampaignProgressBar
            target={
              data?.target_amount ? yoctoNearToFloat(data?.target_amount) : 0
            }
            minAmount={
              data?.min_amount ? yoctoNearToFloat(data?.min_amount) : 0
            }
            targetMet={data?.total_raised_amount === data?.max_amount}
            isStarted={isStarted}
            amount={
              data?.total_raised_amount
                ? yoctoNearToFloat(data?.total_raised_amount)
                : 0
            }
            endDate={Number(data?.end_ms)}
          />
          <DonateToCampaignProjects
            campaignId={data.id}
            variant="standard-outline"
            disabled={
              isStarted || data?.total_raised_amount === data?.max_amount
            }
          />
        </div>
      </Link>
    </div>
  );
};

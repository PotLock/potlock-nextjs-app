import Image from "next/image";
import Link from "next/link";

import { Campaign } from "@/common/contracts/potlock";
import { truncate, yoctoNearToFloat } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import { Button } from "@/common/ui/components";
import { AccountProfilePicture } from "@/modules/core";
import { DonateToCampaignProjects } from "@/modules/donation";

import { CampaignProgressBar } from "./CampaignProgressBar";

export const CampaignCard = ({ data }: { data: Campaign }) => {
  const isStarted = getTimePassed(Number(data.start_ms), true)?.includes("-");

  return (
    <div
      style={{
        boxShadow:
          "0px 0px 0px 1px rgba(0, 0, 0, 0.06), 0px 2px 2px -1px rgba(5, 5, 5, 0.08), 0px 3px 5px 0px rgba(5, 5, 5, 0.08)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 10px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      }}
      className="md:w-[412px] h-[572px] w-full cursor-pointer rounded-lg transition-all duration-500 ease-in-out"
    >
      <Link href={`/campaign/${data.id}/leaderboard`} passHref>
        <div className="relative h-[212px] w-full">
          <Image
            src={data?.cover_image_url || ""}
            alt=""
            className="h-[212px] w-full rounded-t-lg object-cover hover:scale-150"
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

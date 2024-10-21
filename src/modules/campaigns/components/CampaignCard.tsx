import Image from "next/image";

import { Campaign } from "@/common/contracts/potlock";
import { yoctoNearToFloat } from "@/common/lib";
import { Button } from "@/common/ui/components";

import { CampaignProgressBar } from "./CampaignProgressBar";

export const CampaignCard = ({ data }: { data: Campaign }) => {
  const NO_IMAGE =
    "https://i.near.social/magic/large/https://near.social/magic/img/account/null.near";

  return (
    <div
      style={{
        boxShadow:
          "0px 0px 0px 1px rgba(0, 0, 0, 0.06), 0px 2px 2px -1px rgba(5, 5, 5, 0.08), 0px 3px 5px 0px rgba(5, 5, 5, 0.08)",
      }}
      className="md:w-[412px] h-[572px] w-full rounded-lg"
    >
      <div className="relative h-[212px] w-full">
        <Image
          src={data?.cover_image_url || ""}
          alt=""
          className="h-[212px] w-full rounded-t-lg object-cover"
          width={500}
          height={500}
        />
        <div className="absolute inset-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>{" "}
        <h1 className="absolute bottom-0 px-6 py-3 text-[20px] font-semibold text-white">
          {data.name}
        </h1>
      </div>
      <div className="flex flex-col gap-4 px-6 py-6">
        <div className="flex gap-1">
          <p className="">FOR</p>
          <Image
            alt=""
            src={NO_IMAGE}
            width={20}
            height={20}
            className="rounded-[50%]"
          />
          <p className="">{data.recipient}</p>
        </div>
        <div className="h-[120px]">
          <p className="text-[16px]">{data.description}</p>
        </div>
        <CampaignProgressBar
          target={yoctoNearToFloat(data.target_amount)}
          minAmount={0}
          amount={Number(data.total_raised_amount)}
        />
        <Button variant="standard-outline" className="w-full">
          Donate
        </Button>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";

import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { Campaign } from "@/common/contracts/core";
import { truncate, yoctoNearToFloat } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/common/ui/components/molecules/carousel";
import { AccountProfileLink } from "@/entities/_shared/account";
import { DonateToCampaignProjects } from "@/features/donation";

import { CampaignProgressBar } from "./CampaignProgressBar";

export const FeaturedCampaigns = ({ data }: { data: Campaign[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!data?.length) {
    return <></>;
  }

  return (
    <div className="mt-8 w-full p-0 ">
      <div className="mb-4 flex w-full flex-row justify-between p-2 md:p-0">
        <div className=" flex items-center gap-4 ">
          <h1 className=" text-[18px] font-semibold ">Featured Campaigns</h1>
          <p className="text-[18px]">{current + 1}/3</p>
        </div>
        <div className="flex gap-4">
          <img
            src="/assets/icons/left-arrow.svg"
            alt=""
            onClick={() => api?.scrollTo(current - 1)}
            className="h-6 w-6 cursor-pointer rounded-full border border-gray-400 text-[14px] text-gray-500"
          />
          <img
            src="/assets/icons/right-arrow.svg"
            alt=""
            onClick={() => api?.scrollTo(current + 1)}
            className="h-6 w-6 cursor-pointer rounded-full border border-gray-400 text-[14px] text-gray-500"
          />
        </div>
      </div>
      <Carousel opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {data?.length &&
            data?.slice(0, 3)?.map((data) => <FeaturedCampaignCard key={data.id} data={data} />)}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

const FeaturedCampaignCard = ({ data }: { data: Campaign }) => {
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
        <div className="h-293px relative md:h-[285px] md:w-[68%]">
          <LazyLoadImage
            src={data?.cover_image_url || "/assets/images/list-gradient-3.png"}
            alt=""
            className="inset-1 h-full w-full object-cover md:rounded"
            width={500}
            height={300}
          />
          <div className="absolute inset-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>{" "}
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
            target={data?.target_amount ? yoctoNearToFloat(data?.target_amount) : 0}
            minAmount={data?.min_amount ? yoctoNearToFloat(data?.min_amount) : 0}
            isStarted={isStarted}
            targetMet={data?.total_raised_amount === data?.max_amount}
            amount={data?.total_raised_amount ? yoctoNearToFloat(data?.total_raised_amount) : 0}
            endDate={Number(data?.end_ms)}
          />
          <p className="mt-4 text-start">
            {data?.description ? truncate(data.description, 100) : ""}
          </p>
          <DonateToCampaignProjects
            campaignId={data.id}
            className="mt-4"
            disabled={isStarted || isEnded || data?.total_raised_amount === data?.max_amount}
          />
        </div>
      </Link>
    </CarouselItem>
  );
};

import { useEffect, useState } from "react";

import Link from "next/link";

import { Campaign, campaignsContractHooks } from "@/common/contracts/core";
import {
  Button,
  Carousel,
  CarouselApi,
  CarouselContent,
  PageError,
  PageWithBanner,
  SplashScreen,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { CampaignCarouselItem, CampaignsList } from "@/entities/campaign";

const FeaturedCampaigns = ({ data }: { data: Campaign[] }) => {
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
            data?.slice(0, 3)?.map((data) => <CampaignCarouselItem key={data.id} data={data} />)}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default function CampaignsPage() {
  const {
    isLoading: isCampaignsListLoading,
    data: campaigns,
    error: campaignsLoadingError,
  } = campaignsContractHooks.useCampaigns();

  return (
    <PageWithBanner>
      <div
        className={cn(
          "md:p-18 min-h-100 bg-hero relative w-full",
          "flex flex-col items-start justify-center overflow-hidden",
        )}
      >
        <h1 className="font-500 font-lora text-[48px] tracking-[1.12px]">{"Fund Your Ideas"}</h1>

        <p className="text-[18px] font-extralight leading-[30px] md:w-[50%]">
          {
            "Bring your vision to life with a powerful fundraising campaign to support groundbreaking projects. Reach your goals and make a positive impact on your community"
          }

          <a
            className="cursor-pointer font-semibold text-red-500"
            href="https://potlock.org/learn-campaigns"
            target="_blank"
          >
            {"Learn more"}
          </a>
        </p>

        <Button asChild className="mt-4" variant="brand-filled">
          <Link href="/campaign/create">{"Start Campaign"}</Link>
        </Button>
      </div>

      {campaignsLoadingError !== undefined && (
        <PageError
          title="Unable to load campaigns"
          message={"message" in campaignsLoadingError ? campaignsLoadingError.message : undefined}
        />
      )}

      {campaignsLoadingError === undefined && campaigns === undefined && isCampaignsListLoading && (
        <SplashScreen className="h-100" />
      )}

      {campaignsLoadingError === undefined && campaigns !== undefined && (
        <>
          <FeaturedCampaigns data={campaigns} />
          <CampaignsList campaigns={campaigns} />
        </>
      )}
    </PageWithBanner>
  );
}

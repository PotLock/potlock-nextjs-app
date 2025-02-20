import { useEffect, useState } from "react";

import Link from "next/link";

import { Campaign, campaignsContractHooks } from "@/common/contracts/core/campaigns";
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
        <h3 className="font-500 bold mb-6 mt-0 text-lg tracking-[1.12px] text-[#DD3345]">
          Igniting Campaigns for Impact
        </h3>

        <h1 className="font-500 font-lora m-0 text-[40px] tracking-tight max-md:text-[36px]">
          Discover dynamic campaigns, Support transformative <br className="max-md:hidden" />{" "}
          initiatives, & Join a movement to fuel public goods.
        </h1>

        <div className="flex gap-4">
          <Button asChild className="mt-4" variant="brand-filled">
            <Link href="/campaign/create">{"Start Campaign"}</Link>
          </Button>
          <Button variant="brand-tonal" asChild className="mt-4">
            <Link target="_blank" href="https://potlock.org/learn-campaigns">
              {"Learn More"}
            </Link>
          </Button>
        </div>
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

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
  Spinner,
} from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
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
          <p className="text-[18px]">{current + 1}/8</p>
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
            data
              ?.filter((data) => [13, 12, 11, 10, 9, 7, 6, 3].includes(data?.id))
              ?.map((data) => <CampaignCarouselItem key={data.id} data={data} />)}
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

  const viewer = useWalletUserSession();

  return (
    <PageWithBanner>
      <div
        className={cn(
          "md:p-18 min-h-100 bg-hero relative w-full",
          "flex flex-col items-start justify-center overflow-hidden",
        )}
      >
        <h3 className="mb-3 mt-0 text-base font-semibold text-[#dd3345]">
          Igniting Campaigns for Impact
        </h3>

        <h1 className="lett font-lora m-0 text-4xl font-medium leading-none tracking-tight md:text-[40px]">
          Discover dynamic campaigns, Support transformative <br className="max-md:hidden" />{" "}
          initiatives, & Join a movement to fuel public goods.
        </h1>

        <div className="flex gap-4">
          {viewer.isSignedIn && (
            <Button asChild className="mt-4" variant="brand-filled">
              <Link href="/campaign/create">{"Start Campaign"}</Link>
            </Button>
          )}
          <Button variant="brand-tonal" asChild className="mt-4">
            <Link target="_blank" href="https://docs.potlock.io/user-guides/campaigns">
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
        <div className="flex h-40 items-center justify-center">
          <Spinner className="h-7 w-7" />
        </div>
      )}

      {campaignsLoadingError === undefined && campaigns !== undefined && (
        <>
          <FeaturedCampaigns data={campaigns} />
          <CampaignsList />
        </>
      )}
    </PageWithBanner>
  );
}

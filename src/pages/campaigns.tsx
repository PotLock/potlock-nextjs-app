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
          <p className="text-[18px]">{current + 1}/6</p>
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
              ?.filter((data) => [52, 51, 45, 41, 44, 43].includes(data?.id))
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
          "flex flex-col items-start justify-center gap-4 overflow-hidden",
        )}
      >
        <h3 className="text-base font-semibold text-[#dd3345]">{"Fund Ideas, People, Projects"}</h3>

        <h1
          className={cn(
            "gap--0.1 inline-flex flex-col",
            "font-lora m-0 text-4xl font-medium",
            "leading-none tracking-tight md:text-[40px]",
          )}
        >
          <span className="font-lora">
            {"The fastest way to raise for ideas, causes, bounties, features."}
          </span>

          <span className="font-lora">{"Donate to a cause, share & earn referral fees."}</span>
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

import { useEffect, useState } from "react";

import Link from "next/link";

import { Campaign, indexer } from "@/common/api/indexer";
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
import { rootPathnames } from "@/navigation";

const FEATURED_CAMPAIGN_ON_CHAIN_IDS = [131, 106, 101, 91];

export const FeaturedCampaigns = ({
  data,
  showViewAll = false,
}: {
  data: Campaign[];
  showViewAll?: boolean;
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const featuredCampaigns = (data ?? []).filter((c) =>
    FEATURED_CAMPAIGN_ON_CHAIN_IDS.includes(c?.on_chain_id),
  );

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  if (!featuredCampaigns.length) {
    return <></>;
  }

  return (
    <div className="mt-8 w-full p-0 ">
      <div className="mb-4 flex w-full flex-col gap-4 p-2 md:flex-row md:items-center md:justify-between md:gap-0 md:p-0">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
            Featured Campaigns
          </h1>
          <p className="text-[18px]">
            {current + 1}/{featuredCampaigns.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
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
          {showViewAll && (
            <Button asChild variant="brand-tonal" className="h-8 shrink-0 bg-transparent text-xs">
              <Link href={rootPathnames.CAMPAIGNS} className="text-brand-primary">
                VIEW ALL
              </Link>
            </Button>
          )}
        </div>
      </div>
      <Carousel opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {featuredCampaigns.map((c) => (
            <CampaignCarouselItem key={c.on_chain_id} data={c} />
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default function CampaignsPage() {
  const { data, isLoading, error } = indexer.useCampaigns({
    page: 1,
    page_size: 200,
  });

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
          {!viewer.hasWalletReady ? (
            <div className="mt-4 h-10 w-36 animate-pulse rounded-md bg-gray-200" />
          ) : (
            viewer.isSignedIn && (
              <Button asChild className="mt-4" variant="brand-filled">
                <Link href="/campaign/create">{"Start Campaign"}</Link>
              </Button>
            )
          )}
          <Button variant="brand-tonal" asChild className="mt-4">
            <Link target="_blank" href="https://docs.potlock.io/user-guides/campaigns">
              {"Learn More"}
            </Link>
          </Button>
        </div>
      </div>

      {error !== undefined && (
        <PageError
          title="Unable to load campaigns"
          message={"message" in error ? error.message : undefined}
        />
      )}

      {error === undefined && data?.results === undefined && isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Spinner className="h-7 w-7" />
        </div>
      )}

      {error === undefined && data?.results !== undefined && (
        <>
          <FeaturedCampaigns data={data?.results} />
          <CampaignsList />
        </>
      )}
    </PageWithBanner>
  );
}

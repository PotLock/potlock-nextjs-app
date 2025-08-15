import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ENV_TAG, FEATURE_REGISTRY, NETWORK } from "@/common/_config";
import { indexer } from "@/common/api/indexer";
import { APP_BOS_COUNTERPART_URL, PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import {
  Button,
  Carousel,
  CarouselApi,
  CarouselContent,
  PageWithBanner,
  Skeleton,
} from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { AccountCard } from "@/entities/_shared/account";
import { DonateRandomly, DonateToAccountButton } from "@/features/donation";
import { ProjectDiscovery } from "@/layout/components/project-discovery";
import { rootPathnames } from "@/pathnames";

import { FeaturedCampaigns } from "./campaigns";

export const FEATURED_PROJECT_ACCOUNT_IDS =
  NETWORK === "mainnet"
    ? [
        "v1.foodbank.near",
        "potlock.near",
        "yearofchef.near",
        "indexers.intear.near",
        "nearblocks.near",
      ]
    : ["amichaeltest.testnet", "root.akaia.testnet", "yearofchef.testnet"];

export const GeneralStats = () => {
  const { data: stats } = indexer.useStats();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="mt-4 flex flex-row flex-wrap items-center gap-4 px-2 py-0 md:gap-6 md:px-10">
        <div className="flex flex-row items-baseline gap-2 text-xl font-semibold text-[#dd3345]">
          {stats?.total_donations_usd === undefined ? (
            <Skeleton className="h-5.5 w-29" />
          ) : (
            <span>{`$${stats?.total_donations_usd?.toLocaleString()}`}</span>
          )}

          <div className="text-sm font-normal text-[#656565]">Donated</div>
        </div>

        <div className="flex flex-row items-baseline gap-2 text-xl font-semibold text-[#dd3345]">
          {stats?.total_donations_count === undefined ? (
            <Skeleton className="h-5.5 w-29" />
          ) : (
            <span>{`${stats?.total_donations_count?.toLocaleString()}`}</span>
          )}

          <div className="text-sm font-normal text-[#656565]">Donations</div>
        </div>
      </div>

      {/* Line */}
      <div className="h-px w-full bg-neutral-100" />
    </div>
  );
};

const WelcomeBanner = () => {
  const viewer = useWalletUserSession();

  return (
    <div
      className={cn(
        "bg-hero relative flex w-full flex-col justify-center overflow-hidden",
        "border border-solid border-[#f8d3b0] bg-cover bg-no-repeat md:rounded-xl",
      )}
    >
      <div className="relative z-[1] flex flex-col justify-center px-5 py-12 md:px-10 md:py-16">
        <h3 className="mb-3 mt-0 text-base font-semibold text-[#dd3345]">
          {"Opening funding up for anything"}
        </h3>

        <h1 className="lett font-lora m-0 text-4xl font-medium leading-[1.1] tracking-tight md:text-[40px]">
          Discover ideas, projects, people, opportunities,
          <br className="hidden md:block" /> and grant pools to fund.
        </h1>

        <div className="mt-6 flex items-center gap-4 text-sm max-md:flex-col md:mt-10 md:gap-8">
          <DonateRandomly />

          {!viewer.isMetadataLoading && viewer.isSignedIn && (
            <>
              {FEATURE_REGISTRY.ProfileConfiguration.isEnabled ? (
                <Button asChild className="w-full md:w-[180px]" variant={"brand-tonal"}>
                  <Link
                    href={
                      viewer.hasRegistrationSubmitted
                        ? `${rootPathnames.PROFILE}/${viewer.accountId}`
                        : rootPathnames.REGISTER
                    }
                    prefetch={true}
                  >
                    {viewer.hasRegistrationSubmitted
                      ? "View Your Project"
                      : "Register Your Project"}
                  </Link>
                </Button>
              ) : (
                <Button asChild className="w-full md:w-[180px]" variant={"brand-tonal"}>
                  <Link
                    href={
                      viewer.hasRegistrationSubmitted
                        ? `${rootPathnames.PROFILE}/${viewer.accountId}`
                        : `${APP_BOS_COUNTERPART_URL}/?tab=createproject`
                    }
                    prefetch={true}
                  >
                    {viewer.hasRegistrationSubmitted
                      ? "View Your Project"
                      : "Register Your Project (BOS App)"}
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const { data: campaigns } = indexer.useCampaigns({
    enabled: ENV_TAG !== "production",
  });

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <PageWithBanner>
      <WelcomeBanner />
      <GeneralStats />
      {ENV_TAG !== "production" && (
        <div className="mt-8 w-full p-0">
          <FeaturedCampaigns data={campaigns?.results ?? []} />
        </div>
      )}
      <div className="flex w-full flex-col gap-4 px-2 pt-10 md:gap-10 md:pt-12">
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-row items-center justify-between text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
            {"Featured projects"}
            <div className="flex gap-6">
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
        </div>

        <Carousel
          opts={{
            loop: true,
            align: "start",
            duration: 20,
            dragFree: true,
          }}
          setApi={setApi}
        >
          <CarouselContent className="flex w-full flex-row gap-4 p-4">
            {FEATURED_PROJECT_ACCOUNT_IDS.map((projectAccountId) => (
              <AccountCard
                key={projectAccountId}
                accountId={projectAccountId}
                actions={<DonateToAccountButton accountId={projectAccountId} />}
              />
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <ProjectDiscovery
        listId={PUBLIC_GOODS_REGISTRY_LIST_ID}
        noResultsPlaceholder={
          <div className="min-h-140 flex w-full flex-col items-center justify-center">
            <Image
              src="/assets/icons/no-list.svg"
              alt="No results found"
              width={200}
              height={200}
              className="h-50 w-50 mb-4"
            />

            <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
              <p className="w-100 font-lora text-center italic">{"No results found"}</p>
            </div>
          </div>
        }
      />
    </PageWithBanner>
  );
}

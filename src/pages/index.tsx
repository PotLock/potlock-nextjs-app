import Image from "next/image";
import Link from "next/link";

import { NETWORK } from "@/common/_config";
import { indexer } from "@/common/api/indexer";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { Button } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useWalletUserSession } from "@/common/wallet";
import { AccountCard } from "@/entities/_shared/account";
import { DonateRandomly, DonateToAccountButton } from "@/features/donation";
import { ProjectDiscovery } from "@/layout/components/project-discovery";
import { rootPathnames } from "@/pathnames";

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
          {`$${stats?.total_donations_usd.toString()}`}
          <div className="text-sm font-normal text-[#656565]">Donated</div>
        </div>

        <div className="flex flex-row items-baseline gap-2 text-xl font-semibold text-[#dd3345]">
          {stats?.total_donations_count.toString()}
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
          {"Transforming Funding for Public Goods"}
        </h3>

        <h1 className="lett font-lora m-0 text-4xl font-medium leading-none tracking-tight md:text-[40px]">
          Discover impact projects, donate directly, &
          <br className="hidden md:block" /> participate in funding rounds.
        </h1>

        <div className="mt-6 flex items-center gap-4 text-sm max-md:flex-col md:mt-10 md:gap-8">
          <DonateRandomly />

          {!viewer.isMetadataLoading && viewer.isSignedIn && (
            <Button className="w-full md:w-[180px]" variant={"brand-tonal"} asChild>
              <Link
                href={
                  viewer.hasRegistrationSubmitted
                    ? `${rootPathnames.PROFILE}/${viewer.accountId}`
                    : rootPathnames.REGISTER
                }
                prefetch={true}
              >
                {viewer.hasRegistrationSubmitted ? "View Your Project" : "Register Your Project"}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <main className="2xl-container flex flex-col items-center">
      <div className="flex w-full flex-col md:px-10">
        <WelcomeBanner />
        <GeneralStats />
      </div>

      <div className="flex w-full flex-col gap-10 px-2 pt-10 md:px-10 md:pt-12">
        <div className="flex w-full flex-col gap-5">
          <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
            {"Featured projects"}
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 p-0.5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED_PROJECT_ACCOUNT_IDS.map((projectAccountId) => (
            <AccountCard
              key={projectAccountId}
              accountId={projectAccountId}
              actions={<DonateToAccountButton accountId={projectAccountId} />}
            />
          ))}
        </div>
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
    </main>
  );
}

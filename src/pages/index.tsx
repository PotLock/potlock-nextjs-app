import Link from "next/link";

import { indexer } from "@/common/api/indexer";
import { useSessionReduxStore, useWallet } from "@/common/services/auth";
import { Button } from "@/common/ui/components";
import { useRegistration } from "@/entities/core";
import { ProjectDiscovery, ProjectDiscoveryFeatured } from "@/entities/project";
import { DonateRandomly } from "@/features/donation";
import routesPath from "@/pathnames";
import { useGlobalStoreSelector } from "@/store";

export const GeneralStats = () => {
  const { data: stats } = indexer.useStats();

  return (
    <div className="flex w-full flex-col ">
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
      <div className="mt-4 h-px w-full bg-[#ebebeb]" />
    </div>
  );
};

const WelcomeBanner = () => {
  const { defaultAddress, toggle } = useGlobalStoreSelector((state) => state.nav.actAsDao);

  const daoAddress = toggle && defaultAddress ? defaultAddress : "";
  const wallet = useWallet();
  const accountId = daoAddress || wallet?.wallet?.accountId || "";
  const { isAuthenticated } = useSessionReduxStore();

  const { loading, isRegisteredProject } = useRegistration(accountId);

  return (
    <div className="bg-hero relative flex w-full flex-col justify-center overflow-hidden rounded-xl border border-solid border-[#f8d3b0] bg-cover bg-no-repeat">
      <div className="relative z-[1] flex flex-col justify-center px-5  py-12 md:px-10 md:py-16">
        <h3 className="mb-3 mt-0 text-base font-semibold text-[#dd3345]">
          Transforming Funding for Public Goods
        </h3>

        <h1 className="lett font-lora m-0 text-4xl font-medium leading-none tracking-tight md:text-[40px]">
          Discover impact projects, donate directly, &
          <br className="hidden md:block" /> participate in funding rounds.
        </h1>

        <div className="mt-6 flex items-center gap-4 text-sm max-md:flex-col md:mt-10 md:gap-8">
          <DonateRandomly />

          {isAuthenticated && !loading && (
            <Button className="w-full md:w-[180px]" variant={"brand-tonal"} asChild>
              <Link
                href={
                  isRegisteredProject
                    ? `${routesPath.PROFILE}/${accountId}`
                    : routesPath.CREATE_PROJECT
                }
                prefetch={true}
              >
                {isRegisteredProject ? "View Your Project" : "Register Your Project"}
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
    <main className="container flex flex-col items-center">
      <WelcomeBanner />
      <GeneralStats />
      <ProjectDiscoveryFeatured />
      <ProjectDiscovery />
    </main>
  );
}

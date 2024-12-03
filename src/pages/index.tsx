import Link from "next/link";

import { indexer } from "@/common/api/indexer";
import { Button } from "@/common/ui/components";
import { DonateRandomly } from "@/features/donation";
import { useRegistration } from "@/entities/core";
import routesPath from "@/entities/core/routes";
import { ProjectDiscovery, ProjectDiscoveryFeatured } from "@/entities/project";
import { useAuth, useWallet } from "@/entities/session";
import { useGlobalStoreSelector } from "@/store";

export const GeneralStats = () => {
  const { data: stats } = indexer.useStats();

  return (
    <div className="flex w-full flex-col ">
      <div className="md:gap-6 md:px-10 mt-4 flex flex-row flex-wrap items-center gap-4 px-2 py-0">
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
  const { isAuthenticated } = useAuth();

  const { loading, isRegisteredProject } = useRegistration(accountId);

  return (
    <div className="relative flex w-full flex-col justify-center overflow-hidden rounded-xl border border-solid border-[#f8d3b0] bg-hero bg-cover bg-no-repeat">
      <div className="md:px-10 md:py-16 relative z-[1] flex flex-col  justify-center px-5 py-12">
        <h3 className="mb-3 mt-0 text-base font-semibold text-[#dd3345]">
          Transforming Funding for Public Goods
        </h3>

        <h1 className="lett md:text-[40px] m-0 font-lora text-4xl font-medium leading-none tracking-tight">
          Discover impact projects, donate directly, &
          <br className="md:block hidden" /> participate in funding rounds.
        </h1>

        <div className="max-md:flex-col md:mt-10 md:gap-8 mt-6 flex items-center gap-4 text-sm">
          <DonateRandomly />

          {isAuthenticated && !loading && (
            <Button className="md:w-[180px] w-full" variant={"brand-tonal"} asChild>
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

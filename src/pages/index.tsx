import Link from "next/link";

import { Button } from "@/common/ui/components";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import useWallet from "@/modules/auth/hooks/useWallet";
import { GeneralStats, useRegistration } from "@/modules/core";
import routesPath from "@/modules/core/routes";
import { DonateRandomly } from "@/modules/donation";
import { ProjectsOverview, ProjectsOverviewFeatured } from "@/modules/project";
import { useTypedSelector } from "@/store";

const WelcomeBanner = () => {
  const { defaultAddress, toggle } = useTypedSelector(
    (state) => state.nav.actAsDao,
  );

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
            <Button
              className="md:w-[180px] w-full"
              variant={"brand-tonal"}
              asChild
            >
              <Link
                href={
                  isRegisteredProject
                    ? `${routesPath.PROFILE}/${accountId}`
                    : routesPath.CREATE_PROJECT
                }
                prefetch={true}
              >
                {isRegisteredProject
                  ? "View Your Project"
                  : "Register Your Project"}
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
      <ProjectsOverviewFeatured />
      <ProjectsOverview />
    </main>
  );
}

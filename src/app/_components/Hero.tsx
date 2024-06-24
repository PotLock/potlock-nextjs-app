import Link from "next/link";

import { potlock } from "@/common/api/potlock";
import { Button } from "@/common/ui/components";
import useWallet from "@/modules/auth/hooks/useWallet";
import useRegistration from "@/modules/core/hooks/useRegistration";
import { useDonation } from "@/modules/donation";

const Hero = () => {
  const wallet = useWallet();
  const accountId = wallet?.wallet?.accountId || "";

  const { registration, loading } = useRegistration(accountId);
  const isRegisteredProject = !!registration.id;

  const { isLoading: isAccountListLoading, data: accountList } =
    potlock.useAccounts();

  const randomProjectAccountId = "unknown";

  const { openDonationModal: openRandomDonationModal } = useDonation({
    accountId: randomProjectAccountId ?? "unknown",
  });

  return (
    <div className="relative flex w-full flex-col justify-center overflow-hidden rounded-xl border border-solid border-[#f8d3b0] bg-hero bg-cover bg-no-repeat">
      <div className="relative z-[1] flex flex-col justify-center px-5  py-12 md:px-10 md:py-16">
        <h3 className="mb-3 mt-0 text-base font-semibold text-[#dd3345]">
          Transforming Funding for Public Goods
        </h3>
        <h1 className="lett m-0 font-lora text-4xl font-medium leading-none tracking-tight md:text-[40px]">
          Discover impact projects, donate directly, &
          <br className="hidden md:block" /> participate in funding rounds.
        </h1>
        <div className="mt-6 flex items-center gap-4 text-sm max-md:flex-col md:mt-10 md:gap-8">
          {isAccountListLoading
            ? null
            : randomProjectAccountId && (
                <Button
                  className="w-full md:w-[180px]"
                  onClick={openRandomDonationModal}
                >
                  Donate Randomly
                </Button>
              )}

          {!loading && (
            <Button
              className="w-full md:w-[180px]"
              variant={"brand-tonal"}
              asChild
            >
              <Link
                href={
                  isRegisteredProject ? `/user/${accountId}` : "/createproject"
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

export default Hero;

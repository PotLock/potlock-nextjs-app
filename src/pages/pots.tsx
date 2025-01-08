import { useEffect, useState } from "react";

import Link from "next/link";

import { potFactoryContractClient } from "@/common/contracts/core";
import { Button, PageWithBanner } from "@/common/ui/components";
import { useWallet } from "@/entities/_shared/session";
import { ActivePots } from "@/entities/pot";
import { rootPathnames } from "@/pathnames";

const Banner = () => {
  const { wallet } = useWallet();

  const [isPotDeploymentAvailable, updatePotDeploymentAvailability] = useState(false);

  useEffect(() => {
    if (wallet?.accountId) {
      potFactoryContractClient
        .isDeploymentAvailable({
          accountId: wallet.accountId,
        })
        .then(updatePotDeploymentAvailability);
    }
  }, [wallet?.accountId]);

  return (
    <div className="bg-hero relative flex min-h-[400px] w-full flex-col justify-center overflow-hidden">
      <div className="z-1 relative flex flex-col justify-center p-[64px] max-md:p-[64px_20px]">
        <h3 className="font-500 mb-6 mt-0 text-sm uppercase tracking-[1.12px]">Explore Pots</h3>
        <h1 className="font-500 font-lora m-0 text-[40px] tracking-tight max-md:text-[36px]">
          Donate to Matching Rounds <br className="max-md:hidden" /> to Get Your Contributions
          Amplified.
        </h1>
        <div className="max-xs:w-full max-xs:p-[12px_0px] mt-6 mt-[40px] flex items-center gap-8 max-md:flex-col max-md:gap-4">
          {isPotDeploymentAvailable && (
            <Button asChild>
              <Link href={rootPathnames.DEPLOY_POT}>Deploy Pot</Link>
            </Button>
          )}
          <Link
            href="https://docs.potlock.io/user-guides/matched-donations-or-donate-through-a-pot"
            target="_blank"
          >
            <Button variant={isPotDeploymentAvailable ? "brand-tonal" : "brand-filled"}>
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function PotsPage() {
  return (
    <PageWithBanner>
      <Banner />
      <ActivePots />
    </PageWithBanner>
  );
}

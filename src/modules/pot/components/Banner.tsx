import { useEffect, useState } from "react";

import Link from "next/link";

import { potFactoryClient } from "@/common/contracts/core";
import { Button } from "@/common/ui/components";
import { useWallet } from "@/modules/auth";
import routesPath from "@/modules/core/routes";

const Banner = () => {
  const { wallet } = useWallet();

  const [isPotDeploymentAvailable, updatePotDeploymentAvailability] = useState(false);

  useEffect(() => {
    if (wallet?.accountId) {
      potFactoryClient
        .isDeploymentAvailable({
          accountId: wallet.accountId,
        })
        .then(updatePotDeploymentAvailability);
    }
  }, [wallet?.accountId]);

  return (
    <div className="relative flex min-h-[400px] w-full flex-col justify-center overflow-hidden bg-hero">
      <div className="z-1 max-md:p-[64px_20px] relative flex flex-col justify-center p-[64px]">
        <h3 className="font-500 mb-6 mt-0 text-sm uppercase tracking-[1.12px]">Explore Pots</h3>
        <h1 className="font-500 max-md:text-[36px] m-0 font-lora text-[40px] tracking-tight">
          Donate to Matching Rounds <br className="max-md:hidden" /> to Get Your Contributions
          Amplified.
        </h1>
        <div className="max-md:flex-col max-md:gap-4 mt-6 mt-[40px] flex items-center gap-8 max-xs:w-full max-xs:p-[12px_0px]">
          {isPotDeploymentAvailable && (
            <Button asChild>
              <Link href={routesPath.DEPLOY_POT}>Deploy Pot</Link>
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

export default Banner;

import { useEffect, useState } from "react";

import Link from "next/link";

import HomeBannerStyle from "@/common/assets/svgs/HomeBannerBackground";
import * as pots from "@/common/contracts/potlock/pots";
import { Button } from "@/common/ui/components";
import useWallet from "@/modules/auth/hooks/useWallet";

const Banner = () => {
  const [canDeploy, setCanDeploy] = useState(false);
  const { wallet } = useWallet();

  useEffect(() => {
    (async () => {
      if (wallet?.accountId) {
        const _canDeploy = await pots.canUserDeployPot({
          accountId: wallet.accountId,
        });
        setCanDeploy(_canDeploy);
      }
    })();
  }, [wallet?.accountId]);

  return (
    <div
      className="relative flex min-h-[400px] w-full flex-col justify-center overflow-hidden"
      style={{
        ...HomeBannerStyle,
      }}
    >
      <div className="z-1 max-md:p-[64px_20px] relative flex flex-col justify-center p-[64px]">
        <h3 className="font-500 mb-6 mt-0 text-sm uppercase tracking-[1.12px]">
          Explore Pots
        </h3>
        <h1 className="font-500 max-md:text-[36px] m-0 font-lora text-[40px] tracking-tighter">
          Donate to Matching Rounds <br className="max-md:hidden" /> to Get Your
          Contributions Amplified.
        </h1>
        <div className="max-md:flex-col max-md:gap-4 mt-6 mt-[40px] flex items-center gap-8 max-xs:w-full max-xs:p-[12px_0px]">
          {canDeploy && (
            <Link href={`?tab=deploypot`}>
              <Button>Deploy Pot</Button>
            </Link>
          )}
          <Link href="https://wtfisqf.com" target="_blank">
            <Button variant={canDeploy ? "brand-tonal" : "brand-filled"}>
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;

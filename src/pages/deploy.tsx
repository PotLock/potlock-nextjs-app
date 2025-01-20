import { isClient } from "@wpdas/naxios";

import { WalletProvider } from "@/common/contexts/wallet";
import { PageWithBanner, SplashScreen } from "@/common/ui/components";
import InfoIcon from "@/common/ui/svg/InfoIcon";
import { cn } from "@/common/ui/utils";
import {
  PotConfigurationEditor,
  usePotDeploymentSuccessMiddleware,
} from "@/features/pot-configuration";

export default function PotDeployPage() {
  usePotDeploymentSuccessMiddleware();

  return !isClient() ? (
    <SplashScreen className="h-screen" />
  ) : (
    <WalletProvider>
      <PageWithBanner>
        <section
          className={cn(
            "bg-hero mb-6 flex w-full flex-col gap-6 border-[#f8d3b0] px-5 py-12 md:px-10 md:py-16",
          )}
        >
          <span className="prose uppercase" un-font="500" un-text="2.75 md:sm">
            Deploy Pot
          </span>

          <h1 className="prose font-500 text-8 font-lora md:text-5xl">
            Deploy a Quadratic Funding Round
          </h1>

          <span un-flex="~" un-gap="2" un-items="center">
            <InfoIcon />

            <a href="https://wtfisqf.com" target="_blank" un-decoration="underline">
              Learn more about quadratic funding
            </a>
          </span>
        </section>

        <PotConfigurationEditor />
      </PageWithBanner>
    </WalletProvider>
  );
}

import InfoIcon from "@/common/assets/svgs/InfoIcon";
import { PageWithBanner } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { PotEditor, useDeploymentSuccessWalletRedirect } from "@/features/pot-editor";

export default function PotDeployPage() {
  useDeploymentSuccessWalletRedirect();

  return (
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

      <PotEditor />
    </PageWithBanner>
  );
}

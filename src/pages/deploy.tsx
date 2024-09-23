import InfoIcon from "@/common/assets/svgs/InfoIcon";
import { PageWithBanner } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import {
  PotEditor,
  useDeploymentSuccessWalletRedirect,
} from "@/modules/pot-editor";

export default function PotDeployPage() {
  useDeploymentSuccessWalletRedirect();

  return (
    <PageWithBanner>
      <section
        className={cn(
          "md:px-10 md:py-16 mb-6 flex w-full flex-col gap-6 border-[#f8d3b0] bg-hero px-5 py-12",
        )}
      >
        <span className="prose uppercase" un-font="500" un-text="2.75 md:sm">
          Deploy Pot
        </span>

        <h1 className="prose font-500 md:text-5xl text-8 font-lora">
          Deploy a Quadratic Funding Round
        </h1>

        <span un-flex="~" un-gap="2" un-items="center">
          <InfoIcon />

          <a
            href="https://wtfisqf.com"
            target="_blank"
            un-decoration="underline"
          >
            Learn more about quadratic funding
          </a>
        </span>
      </section>

      <PotEditor />
    </PageWithBanner>
  );
}

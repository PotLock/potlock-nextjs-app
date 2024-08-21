import InfoIcon from "@/common/assets/svgs/InfoIcon";
import { PageWithBanner } from "@/common/ui/components";
import { PotEditor } from "@/modules/pot";

export default function PotDeployPage() {
  return (
    <PageWithBanner>
      <section
        className="md:px-25 md:py-20 w-full gap-6 border-[#f8d3b0] bg-hero px-5 py-16"
        un-flex="~ col"
        un-text="neutral-950"
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

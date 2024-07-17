import InfoIcon from "@/common/assets/svgs/InfoIcon";

export type PotDeploymentHeroProps = {};

export const PotDeploymentHero: React.FC<PotDeploymentHeroProps> = () => (
  <section
    className="bg-hero"
    un-border="[#f8d3b0]"
    un-w="full"
    un-flex="~ col"
    un-gap="6"
    un-p="x-5 md:x-25 y-16 md:y-20"
    un-text="neutral-950"
  >
    <span className="prose uppercase" un-font="500" un-text="sm">
      Deploy Pot
    </span>

    <h1 className="prose" un-text="4xl" un-font="bold">
      Deploy a Quadratic Funding Round
    </h1>

    <span un-flex="~" un-gap="2" un-items="center">
      <InfoIcon />

      <a href="#" un-decoration="underline">
        Learn more about quadratic funding
      </a>
    </span>
  </section>
);

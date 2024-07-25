import { PotDeploymentFlow, PotDeploymentHero } from "@/modules/pot";

export default function PotDeployPage() {
  return (
    <main un-w="full" un-pb="12" un-flex="~ col" un-gap="12">
      <PotDeploymentHero />
      <PotDeploymentFlow />
    </main>
  );
}

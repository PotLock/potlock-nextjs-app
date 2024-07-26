import { PotDeploymentHero, PotEditor } from "@/modules/pot";

export default function PotsDeployPage() {
  return (
    <main
      className="2xl-container pb-12"
      un-w="full"
      un-flex="~ col"
      un-gap="12"
    >
      <PotDeploymentHero />
      <PotEditor />
    </main>
  );
}

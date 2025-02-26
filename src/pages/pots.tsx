import Link from "next/link";

import { Button, PageWithBanner } from "@/common/ui/layout/components";
import { ActivePots } from "@/entities/pot";
import { PotDeploymentButton } from "@/features/pot-deployment";

const Banner = () => {
  return (
    <div className="bg-hero relative flex min-h-[400px] w-full flex-col justify-center overflow-hidden">
      <div className="z-1 relative flex flex-col justify-center p-[64px] max-md:p-[64px_20px]">
        <h3 className="font-500 mb-6 mt-0 text-sm uppercase tracking-[1.12px]">Explore Pots</h3>
        <h1 className="font-500 font-lora m-0 text-[40px] tracking-tight max-md:text-[36px]">
          Donate to Matching Rounds <br className="max-md:hidden" /> to Get Your Contributions
          Amplified.
        </h1>

        <div
          className={
            "max-xs:w-full max-xs:p-[12px_0px] mt-6 mt-[40px] flex items-center gap-8 max-md:flex-col max-md:gap-4"
          }
        >
          <PotDeploymentButton />

          <Button asChild variant="brand-tonal">
            <Link
              href="https://docs.potlock.io/user-guides/matched-donations-or-donate-through-a-pot"
              target="_blank"
            >
              Learn More
            </Link>
          </Button>
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

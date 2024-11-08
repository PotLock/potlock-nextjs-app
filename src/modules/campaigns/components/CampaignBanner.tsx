import Link from "next/link";

import { Button } from "@/common/ui/components";

export const CampaignBanner = () => {
  return (
    <div className="md:p-18 min-h-100  relative flex w-full flex-col items-start justify-center overflow-hidden bg-hero">
      <h1 className="font-500  font-lora text-[48px] tracking-[1.12px]">
        Fund Your Ideas
      </h1>
      <p className="md:w-[50%] text-[18px] font-extralight leading-[30px]">
        Bring your vision to life with a powerful fundraising campaign to
        support groundbreaking projects. Reach your goals and make a positive
        impact on your community{" "}
        <a
          className="cursor-pointer font-semibold text-red-500"
          href="https://potlock.org/learn-campaigns"
          target="_blank"
        >
          Learn more
        </a>
      </p>
      <Button asChild className="mt-4" variant="brand-filled">
        <Link href="/campaign/create">Start Campaign</Link>
      </Button>
    </div>
  );
};

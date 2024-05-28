"use client";

import DonationStats from "@app/modules/homepage/components/DonationStats";
import Hero from "@app/modules/homepage/components/Hero";
import AllProjects from "@app/modules/project/components/AllProjects";
import FeaturedProjects from "@app/modules/project/components/FeaturedProjects";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Hero />
      <DonationStats />
      <FeaturedProjects />
      <AllProjects />
    </main>
  );
}

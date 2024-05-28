"use client";

import AllProjects from "@/modules/homepage/components/AllProjects";
import DonationStats from "@/modules/homepage/components/DonationStats";
import FeaturedProjects from "@/modules/homepage/components/FeaturedProjects";
import Hero from "@/modules/homepage/components/Hero";

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

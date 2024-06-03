"use client";

import AllProjects from "@/app/_components/AllProjects";
import DonationStats from "@/app/_components/DonationStats";
import FeaturedProjects from "@/app/_components/FeaturedProjects";
import Hero from "@/app/_components/Hero";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Hero />
      <DonationStats />
      <FeaturedProjects />
      {/* <AllProjects /> */}
    </main>
  );
}

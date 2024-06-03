"use client";

import AllProjects from "./_components/AllProjects";
import DonationStats from "./_components/DonationStats";
import FeaturedProjects from "./_components/FeaturedProjects";
import Hero from "./_components/Hero";

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

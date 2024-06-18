"use client";

import { useParams } from "next/navigation";

import PotCard from "@/modules/pot/components/PotCard";

import useProfileData from "../hooks/useProfileData";

const PotsSubPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { profile } = useProfileData(userId);

  return (
    <div className="mb-18 flex w-full flex-col">
      {/* Header Container */}
      <PotCard />
    </div>
  );
};

export default PotsSubPage;

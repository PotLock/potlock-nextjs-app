"use client";

import { useParams } from "next/navigation";

import AboutItem from "../components/AboutItem";
import Github from "../components/Github";
import SmartContract from "../components/SmartContract";
import Team from "../components/Team";
import useProfileData from "../hooks/useProfileData";

const PotsSubPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { profile } = useProfileData(userId);

  return (
    <div className="mb-18 flex w-full flex-col">
      {/* Header Container */}
      <p>aleatórios</p>
    </div>
  );
};

export default PotsSubPage;

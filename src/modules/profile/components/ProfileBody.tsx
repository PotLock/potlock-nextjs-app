"use client";

import { useState } from "react";

import Link from "next/link";

import { ProfileFeedsProps } from "@/common/contracts/potlock/interfaces/post.interfaces";

import ProfileFeeds from "./ProfileFeeds";

const ProfileBody: React.FC<ProfileFeedsProps> = ({ accountId }) => {
  const [selected, setSelected] = useState("feed");
  const navOptions = [
    // { id: "home", label: "Home", href: "home" },
    { id: "feed", label: "Social Feed", href: "feed" },
    // { id: "pots", label: "Pots", href: "pots" },
    // { id: "funds", label: "Fund Raising", href: "funds" },
  ];

  return (
    <>
      <div className="flex w-full justify-start gap-8 overflow-x-scroll border-b border-gray-300 px-16 md:overflow-visible md:px-4">
        {navOptions.map((option: any) => (
          <Link href={`?nav=${option.href}`} key={option.id} passHref>
            <div
              onClick={() => setSelected(option.id)}
              className={`nav-option whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-all duration-300 ${
                selected === option.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500"
              } ${option.disabled ? "pointer-events-none cursor-not-allowed" : ""}`}
            >
              {option.label}
            </div>
          </Link>
        ))}
      </div>
      {selected === "feed" && <ProfileFeeds accountId={accountId} />}
    </>
  );
};

export default ProfileBody;

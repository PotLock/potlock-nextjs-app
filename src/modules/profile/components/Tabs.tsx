"use client";

import { useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { TabNav } from "../types";

type Props = {
  navOptions: TabNav[];
};

const Tabs = ({ navOptions }: Props) => {
  const { tab } = useParams<{ tab: string }>();
  const [selectedTab] = useState(tab || navOptions[0].id);

  return (
    <div className="mb-[46px] flex w-full flex-row flex-wrap gap-2">
      <div className="w-full px-[1rem]  md:px-[4.5rem]">
        <div className="border-b-solid flex w-full justify-start gap-8 overflow-y-auto border-b-[1px] border-b-[#c7c7c7] pt-8">
          {navOptions.map((option) => {
            const selected = option.id == selectedTab;
            return (
              <Link
                key={option.id}
                className={`font-500 border-b-solid transition-duration-300 whitespace-nowrap border-b-[2px] px-4 py-[10px] text-sm text-[#7b7b7b] transition-all hover:border-b-[#292929] hover:text-[#292929] ${selected ? "border-b-[#292929] text-[#292929]" : "border-b-[transparent]"}`}
                href={option.href}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tabs;

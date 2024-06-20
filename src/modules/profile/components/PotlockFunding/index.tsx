import { useEffect, useState } from "react";

import useDonationsForProject from "@/modules/core/hooks/useDonationsForProject";

import Stats, { Stat } from "./Stats";
import { Option } from "../Dropdown";

type Props = {
  projectId: string;
};

const PotlockFunding = ({ projectId }: Props) => {
  const { donations, near, uniqueDonors } = useDonationsForProject(projectId);
  console.log(donations);

  // Stats
  const [sortDropdownItems, setSortDropdownItems] = useState<Option[]>([
    {
      label: "Loading...",
      val: "",
    },
  ]);

  const [selectedSortOption, setSelectedSortOptions] = useState(
    sortDropdownItems[0],
  );

  const stats: Stat[] = [
    {
      // TODO: Near value is failing sometimes. Cache the usdToNear value, load it once and use many
      value: (near as string) || "",
      label: "Donated",
    },
    {
      value: uniqueDonors.toString() || "",
      label: "Unique donors",
    },
    {
      value: "0.00N",
      label: "Total Matched",
      hideSeparator: true,
    },
  ];

  // TODO: Can't complete this sort items now because the donations_type info is missing
  const donationTypeDescription = {
    all: "All donations",
    direct: "Direct donations",
    matched: "Matched donations",
    payout: "Matching pool allocations",
    sponsorship: "Sponsorships",
  };

  useEffect(() => {
    if (donations) {
      const dropdownItems = [
        {
          label: "All donations",
          val: "all",
          count: donations?.length,
        },
        // TODO: Can't complete this sort items now because the donations_type info is missing
        {
          label: "Direct donations",
          val: "direct",
          count: 0,
        },
      ];
      setSortDropdownItems(dropdownItems);
      setSelectedSortOptions(dropdownItems[0]);
    }
  }, [donations]);

  const onSelectDropdownOption = (selectedOption: Option) => {
    setSelectedSortOptions(selectedOption);
  };
  // Stats - end

  return (
    // Container
    <div className="flex flex-col gap-[1.5rem]">
      <h3 className="text-size-2xl font-600">Potlock Funding</h3>
      <Stats
        stats={stats}
        sortOptions={sortDropdownItems}
        selectedSortOption={selectedSortOption}
        onSelectSortOption={onSelectDropdownOption}
      />
    </div>
  );
};

export default PotlockFunding;

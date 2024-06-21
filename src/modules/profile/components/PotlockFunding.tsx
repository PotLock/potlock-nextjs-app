import { useEffect, useState } from "react";

import { DonationInfo } from "@/common/api/potlock/account";
import useDonationsForProject from "@/modules/core/hooks/useDonationsForProject";

import { Option } from "./Dropdown";
import Stats, { Stat } from "./Stats";

type Props = {
  projectId: string;
};

const PotlockFunding = ({ projectId }: Props) => {
  const {
    donations,
    near,
    uniqueDonors,
    directDonations,
    matchedDonations,
    totalMatchedNear,
  } = useDonationsForProject(projectId);

  // Stats
  const [sortDropdownItems, setSortDropdownItems] = useState<Option[]>([
    {
      label: "Loading...",
      type: "all",
    },
  ]);

  const [selectedSortOption, setSelectedSortOptions] = useState(
    sortDropdownItems[0],
  );

  const stats: Stat[] = [
    {
      value: `${near}N`,
      label: "Donated",
    },
    {
      value: uniqueDonors.toString() || "",
      label: "Unique donors",
    },
    {
      value: `${totalMatchedNear}N`,
      label: "Total Matched",
      hideSeparator: true,
    },
  ];

  useEffect(() => {
    if (donations) {
      const dropdownItems = [
        {
          label: "All donations",
          type: "all",
          count: donations?.length,
        },
        {
          label: "Direct donations",
          type: "direct",
          count: directDonations?.length,
        },
        {
          label: "Matched donations",
          type: "matched",
          count: matchedDonations?.length,
        },
      ];
      setSortDropdownItems(dropdownItems);
      setSelectedSortOptions(dropdownItems[0]);
    }
  }, [donations, directDonations, matchedDonations]);

  const onSelectDropdownOption = (selectedOption: Option) => {
    setSelectedSortOptions(selectedOption);
  };
  // Stats - end

  // List Component
  // Donations General Data
  const donationsData: Record<
    string,
    { label: string; donations?: DonationInfo[] }
  > = {
    all: {
      label: "All donations",
      donations,
    },
    direct: {
      label: "Direct donations",
      donations: directDonations,
    },
    matched: {
      label: "Matched donations",
      donations: matchedDonations,
    },
  };

  // TODO: Use this to show on the list
  console.log(donationsData[selectedSortOption.type]);
  // List Component - end

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

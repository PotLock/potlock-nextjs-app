import { useEffect, useMemo, useState } from "react";

import { DonationInfo } from "@/common/api/indexer/deprecated/accounts.deprecated";
import { Option } from "@/modules/core/components/Dropdown";
import Pagination from "@/modules/core/components/Pagination";
import Stats, { Stat } from "@/modules/core/components/Stats";
import useDonationsForProject from "@/modules/core/hooks/useDonationsForProject";
import useDonationsSent from "@/modules/core/hooks/useDonationsSent";

import Arrow from "./Arrow";
import DonationItem from "./DonationItem";
import { FundingListContainer, SearchBar, Sort } from "./styled";

type Props = {
  accountId: string;
  type?: "received" | "donated";
};

const getDate = (donation: DonationInfo) =>
  new Date(donation.donated_at).getTime();

const PER_PAGE = 30; // need to be less than 50

const PotlockFunding = ({ accountId, type = "received" }: Props) => {
  const projectId = accountId;
  const receivedDonations = useDonationsForProject(
    type === "received" ? projectId : "",
  ); // avoid fetch data if type is not "received"
  const sentDonations = useDonationsSent(type === "donated" ? accountId : ""); // avoid fetch data if type is not "donated"
  const {
    donations,
    near,
    uniqueDonors,
    directDonations,
    matchedDonations,
    totalMatchedNear,
  } = type === "received" ? receivedDonations : sentDonations;

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
  const [donationsData, setDonationsData] = useState<
    Record<string, { donations?: DonationInfo[] }>
  >({
    all: {
      donations,
    },
    direct: {
      donations: directDonations,
    },
    matched: {
      donations: matchedDonations,
    },
  });

  useEffect(() => {
    setDonationsData({
      all: {
        donations,
      },
      direct: {
        donations: directDonations,
      },
      matched: {
        donations: matchedDonations,
      },
    });
  }, [directDonations, matchedDonations, donations]);
  // List Component - end

  // Filter (amount | date)
  const [currentFilter, setCurrentFilter] = useState<"date" | "price">("date");
  const [filter, setFilter] = useState<any>({
    date: false, // false === ascending
    price: false, // false === ascending
  });
  const [filteredDonations, setFilteredDonations] = useState(
    donationsData[selectedSortOption.type].donations || [],
  );
  const [totalDonations, setTotalDonations] = useState(
    donationsData[selectedSortOption.type].donations || [],
  );

  useEffect(() => {
    if (donationsData) {
      setTotalDonations(
        donationsData[selectedSortOption.type]?.donations || [],
      );
      setFilteredDonations(
        donationsData[selectedSortOption.type]?.donations || [],
      );
    }
  }, [donationsData, selectedSortOption]);

  const sortDonation = (type: "price" | "date") => {
    setCurrentFilter(type);
    const sort = !filter[type];
    setFilter({ ...filter, [type]: sort });

    // Sort by price
    if (type === "price" && filteredDonations) {
      const sortedDonations = filteredDonations.sort((a, b) =>
        sort
          ? parseInt(b.total_amount) - parseInt(a.total_amount)
          : parseInt(a.total_amount) - parseInt(b.total_amount),
      );
      setFilteredDonations([...sortedDonations]);

      // Sort by date
    } else if (type === "date") {
      const sortedDonations = filteredDonations.sort((a, b) => {
        return sort ? getDate(a) - getDate(b) : getDate(b) - getDate(a);
      });
      setFilteredDonations([...sortedDonations]);
    }
  };

  // Page control - Search
  const [currentPage, setCurrentPage] = useState(1);

  const searchDonations = (searchTerm: string) => {
    // TODO: refactor using fuzzy search pkg
    const filteredApplications = totalDonations.filter((item) => {
      const searchIn = [
        item.pot?.name || "",
        item.recipient.id || "",
        projectId || "",
        item.donor.id || "",
        item.pot?.id || "",
      ];
      return searchIn.some((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    });
    return filteredApplications;
  };

  // Shown items
  const [shownDonationItemsList, setShownDonationItemsList] = useState<
    DonationInfo[]
  >([]);

  useEffect(() => {
    setShownDonationItemsList(
      filteredDonations.slice(
        (currentPage - 1) * PER_PAGE,
        currentPage * PER_PAGE,
      ),
    );
  }, [currentPage, filteredDonations]);

  // Shown Donation Items
  const shownDonationItems = useMemo(() => {
    return shownDonationItemsList.map((donation) => (
      <DonationItem
        key={donation.id}
        donation={donation}
        projectId={projectId}
        type={type}
      />
    ));
  }, [shownDonationItemsList, projectId, type]);

  return (
    // Container
    <div className="flex flex-col gap-[1.5rem]">
      {type === "received" && (
        <h3 className="text-size-2xl font-600">Potlock Funding</h3>
      )}
      <Stats
        stats={type === "donated" ? [stats[0]] : stats}
        sortOptions={sortDropdownItems}
        selectedSortOption={selectedSortOption}
        onSelectSortOption={onSelectDropdownOption}
      />

      <Sort>
        <div
          onClick={() => sortDonation("date")}
          className={`${currentFilter === "date" ? "active" : ""}`}
        >
          Sort Date{" "}
          {currentFilter === "date" && <Arrow active={!filter.date} />}
        </div>
        <div
          onClick={() => sortDonation("price")}
          className={`${currentFilter === "price" ? "active" : ""}`}
        >
          Sort Amount{" "}
          {currentFilter === "price" && <Arrow active={filter.price} />}
        </div>
      </Sort>

      {/* Funding List */}
      <FundingListContainer>
        <div className="header">
          <h3 className="funding tab">
            {projectId ? "Funding Source" : "Project Name"}
          </h3>
          <div
            className="tab sort font-600"
            onClick={() => sortDonation("price")}
          >
            Amount{" "}
            {currentFilter === "price" && <Arrow active={filter.price} />}
          </div>
          <div
            className="tab sort date font-600"
            onClick={() => sortDonation("date")}
          >
            Date {currentFilter === "date" && <Arrow active={!filter.date} />}
          </div>
        </div>

        <SearchBar>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.7549 14.2549H14.9649L14.6849 13.9849C15.6649 12.8449 16.2549 11.3649 16.2549 9.75488C16.2549 6.16488 13.3449 3.25488 9.75488 3.25488C6.16488 3.25488 3.25488 6.16488 3.25488 9.75488C3.25488 13.3449 6.16488 16.2549 9.75488 16.2549C11.3649 16.2549 12.8449 15.6649 13.9849 14.6849L14.2549 14.9649V15.7549L19.2549 20.7449L20.7449 19.2549L15.7549 14.2549ZM9.75488 14.2549C7.26488 14.2549 5.25488 12.2449 5.25488 9.75488C5.25488 7.26488 7.26488 5.25488 9.75488 5.25488C12.2449 5.25488 14.2549 7.26488 14.2549 9.75488C14.2549 12.2449 12.2449 14.2549 9.75488 14.2549Z"
              fill="#C7C7C7"
            />
          </svg>
          <input
            className="shadow-none outline-none"
            placeholder="Search funding"
            onChange={(e) => {
              if (currentPage !== 1) setCurrentPage(1);
              const filtered = searchDonations(e.target.value);
              setFilteredDonations(filtered);
            }}
            type="text"
          />
        </SearchBar>

        {/* Donation Items */}
        {shownDonationItems}
      </FundingListContainer>
      <Pagination
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
        data={filteredDonations}
        currentPage={currentPage}
        perPage={PER_PAGE}
      />
    </div>
  );
};

export default PotlockFunding;

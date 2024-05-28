import React, { useEffect, useState } from "react";

import {
  Registration,
  RegistrationStatus,
} from "@app/contracts/potlock/interfaces/lists.interfaces";
import { getRegistrations } from "@app/contracts/potlock/lists";

import Card from "./Card";

const AllProjects = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    Registration[]
  >([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      const registrations = await getRegistrations();
      const approvedRegistrations = registrations.filter(
        (registration) => registration.status == RegistrationStatus.Approved,
      );
      approvedRegistrations.sort(() => Math.random() - 0.5);

      setRegistrations(registrations);
      setFilteredRegistrations(approvedRegistrations);
    };
    fetchRegistrations();
  }, []);

  return (
    <div className="flex w-full flex-col px-2 pt-10 md:px-10 md:pb-0 md:pt-12">
      <div className="flex w-full flex-col gap-5">
        <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
          All projects
          <span
            style={{ color: "#DD3345", marginLeft: "8px", fontWeight: 600 }}
          >
            {filteredRegistrations.length}
          </span>
        </div>
        {/* <FilterWrapper>
          <FilterDropdown
            {...{
              onClick: handleTag,
              multipleOptions: true,
              options: tagsList,
              defaultSelected: {
                Status: ["Approved"],
              },
              menuClass: "filter-menu",
            }}
          />

          <SearchBar
            {...{
              title: sort,
              numItems: filteredProjects.length,
              itemName: "project",
              sortList: Object.values(SORT_FILTERS),
              FilterMenuClass: `left-side-menu`,
              setSearchTerm: onSearchChange,
              handleSortChange: (filter) => {
                handleSortChange(filter);
              },
            }}
          />
        </FilterWrapper> */}
      </div>
      <div className="flex w-full flex-col items-center overflow-y-hidden pt-[5px]">
        {filteredRegistrations.length ? (
          <div className="mt-8 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRegistrations.slice(0, 1).map((registration) => (
              <Card
                projectId={registration.registrant_id}
                key={registration.id}
              />
            ))}
          </div>
        ) : (
          <div style={{ alignSelf: "flex-start", margin: "24px 0px" }}>
            No results
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;

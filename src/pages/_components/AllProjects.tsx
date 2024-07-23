import React, { useEffect, useState } from "react";

import {
  Registration,
  RegistrationStatus,
} from "@/common/contracts/potlock/interfaces/lists.interfaces";
import { getRegistrations } from "@/common/contracts/potlock/lists";
import {
  Filter,
  Group,
  InfiniteScroll,
  SearchBar,
  SortSelect,
} from "@/common/ui/components";
import { Profile } from "@/modules/profile/models";
import { ProjectCard } from "@/modules/project";
import { categories, statuses } from "@/modules/project/constants";
import { useTypedSelector } from "@/store";

const MAXIMUM_CARDS_PER_INDEX = 9;

const AllProjects = () => {
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    Registration[]
  >([]);
  const [index, setIndex] = useState(1);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setsStatusFilter] = useState<string[]>(["Approved"]);

  const SORT_LIST_PROJEECTS = [
    { label: "Most recent", value: "recent" },
    { label: "Least recent", value: "older" },
  ];

  const tagsList: Group[] = [
    {
      label: "Category",
      options: categories,
      props: {
        value: categoryFilter,
        onValueChange: (value) => setCategoryFilter(value),
      },
    },
    {
      label: "Status",
      options: statuses,
      props: {
        value: statusFilter,
        onValueChange: (value) => {
          if (value[value.length - 1] === "all") {
            setsStatusFilter(["all"]);
          } else if (value.includes("all")) {
            const filter = value.filter((item) => item !== "all");
            setsStatusFilter(filter);
          } else {
            setsStatusFilter(value);
          }
        },
      },
    },
  ];

  const handleSort = (sortType: string) => {
    const projects = [...filteredRegistrations];
    switch (sortType) {
      case "recent":
        projects.sort((a, b) => b.submitted_ms - a.submitted_ms);
        setFilteredRegistrations(projects);
        break;
      case "older":
        projects.sort((a, b) => a.submitted_ms - b.submitted_ms);
        setFilteredRegistrations(projects);
        break;
      default:
        break;
    }
  };

  const registrationsProfile = useTypedSelector((state) => state.profiles);

  // handle search & filter
  useEffect(() => {
    // Search
    const handleSearch = (registration: Registration, profile: Profile) => {
      if (search === "") return true;
      const { registrant_id: registrantId } = registration;
      const { socialData, tags, team } = profile || {};
      // registration fields to search in
      const fields = [
        registrantId,
        socialData?.description,
        socialData?.name,
        tags?.join(" "),
        team?.join(" "),
      ];

      return fields.some((item) => (item || "").toLowerCase().includes(search));
    };
    // Filter by registration status
    const handleStatus = (registration: Registration) => {
      if (statusFilter.includes("all") || statusFilter.length === 0) {
        return true;
      }
      return statusFilter.includes(registration.status);
    };
    // Filter by registration category
    const handleCategory = (profile: Profile) => {
      const tags = profile.tags || [];

      if (categoryFilter.length === 0) return true;
      return categoryFilter.some((tag: string) => tags.includes(tag));
    };

    if (search || categoryFilter.length || statusFilter.length) {
      const filteredRegistrations = registrations.filter((registration) => {
        const profile = registrationsProfile[registration.registrant_id] || {};

        return (
          handleSearch(registration, profile) &&
          handleCategory(profile) &&
          handleStatus(registration)
        );
      });

      setFilteredRegistrations(filteredRegistrations);
    }
  }, [
    search,
    categoryFilter,
    statusFilter,
    registrations,
    registrationsProfile,
  ]);

  // Fetch Registrations
  useEffect(() => {
    const fetchRegistrations = async () => {
      const registrations = await getRegistrations();
      registrations.sort(() => Math.random() - 0.5);

      const approvedRegistrations = registrations.filter(
        (registration) => registration.status == RegistrationStatus.Approved,
      );

      setRegistrations(registrations);
      setFilteredRegistrations(approvedRegistrations);
    };
    fetchRegistrations();
  }, []);

  return (
    <div className="md:px-10 md:py-12 flex w-full flex-col px-2 py-10">
      <div className="flex w-full flex-col gap-5">
        <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
          All projects
          <span
            style={{ color: "#DD3345", marginLeft: "8px", fontWeight: 600 }}
          >
            {filteredRegistrations.length}
          </span>
        </div>
        <div className="flex w-full items-center gap-4">
          <SearchBar
            placeholder="Search projects"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
          <Filter
            // toggleProps={{
            //   onValueChange: handleTag,
            // }}
            groups={tagsList}
          />
          <SortSelect
            options={SORT_LIST_PROJEECTS}
            onValueChange={handleSort}
          />
        </div>
      </div>
      {filteredRegistrations.length ? (
        <InfiniteScroll
          className="p-0.5"
          items={filteredRegistrations}
          index={index}
          setIndex={setIndex}
          size={MAXIMUM_CARDS_PER_INDEX}
          renderItem={(registration: Registration) => (
            <ProjectCard
              projectId={registration.registrant_id}
              key={registration.id}
            />
          )}
        />
      ) : (
        <div style={{ alignSelf: "flex-start", margin: "24px 0px" }}>
          No results
        </div>
      )}
    </div>
  );
};

export default AllProjects;

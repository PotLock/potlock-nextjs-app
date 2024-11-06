import React, { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import { ListRegistration } from "@/common/api/indexer";
import { toChronologicalOrder } from "@/common/lib";
import {
  Filter,
  InfiniteScroll,
  SearchBar,
  SortSelect,
} from "@/common/ui/components";
import { ListCardSkeleton } from "@/modules/lists/components/ListCardSkeleton";
import { Profile } from "@/modules/profile/models";
import { useTypedSelector } from "@/store";

import { ProjectCard } from "./ProjectCard";
import { useProjectsFilters } from "../hooks/useProjectsFilters";

const MAXIMUM_CARDS_PER_INDEX = 9;

export const ProjectsOverview = ({
  setCurrentFilterCategory,
  setCurrentFilterStatus,
  filteredRegistrations,
  setFilteredRegistrations,
}: {
  setCurrentFilterCategory: (type: string[]) => void;
  setCurrentFilterStatus: (type: string) => void;
  filteredRegistrations: ListRegistration[];
  setFilteredRegistrations: (type: any) => void;
}) => {
  const [index, setIndex] = useState(1);
  const [search, setSearch] = useState("");

  const { registrations, tagList, loading } = useProjectsFilters(
    (type: string) => setCurrentFilterCategory([type]),
    setCurrentFilterStatus,
    setFilteredRegistrations,
  );
  const SORT_LIST_PROJECTS = [
    { label: "Most recent", value: "recent" },
    { label: "Least recent", value: "older" },
  ];

  const chronologicallySortedProjects = useMemo(() => {
    return toChronologicalOrder("submitted_at", filteredRegistrations);
  }, [filteredRegistrations]);

  const handleSort = (sortType: string) => {
    switch (sortType) {
      case "recent":
        setFilteredRegistrations(chronologicallySortedProjects.toReversed());
        break;
      case "older":
        setFilteredRegistrations(chronologicallySortedProjects);
        break;
      default:
        break;
    }
  };

  const registrationsProfile = useTypedSelector((state) => state.profiles);

  // handle search & filter
  useEffect(() => {
    // Search
    const handleSearch = (registration: ListRegistration, profile: Profile) => {
      if (search === "") return true;
      const { id: registrantId } = registration.registrant;
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
    const filtered = registrations.filter((registration) => {
      const profile = registrationsProfile[registration.registrant.id] || {};

      return handleSearch(registration, profile);
    });
    setFilteredRegistrations(filtered);
  }, [search, registrations, registrationsProfile, setFilteredRegistrations]);

  return (
    <div className="md:px-10 md:py-12 flex w-full flex-col px-2 py-10">
      <div className="flex w-full flex-col gap-5">
        <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
          All projects
          <span
            style={{ color: "#DD3345", marginLeft: "8px", fontWeight: 600 }}
          >
            {filteredRegistrations?.length}
          </span>
        </div>
        <div className="flex w-full items-center gap-4">
          <SearchBar
            placeholder="Search projects"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
          <Filter groups={tagList} />
          <SortSelect options={SORT_LIST_PROJECTS} onValueChange={handleSort} />
        </div>
      </div>
      {loading ? (
        Array.from({ length: 6 }, (_, index) => (
          <ListCardSkeleton key={index} />
        ))
      ) : filteredRegistrations?.length ? (
        <InfiniteScroll
          className="p-0.5"
          items={filteredRegistrations}
          index={index}
          setIndex={setIndex}
          size={MAXIMUM_CARDS_PER_INDEX}
          renderItem={(registration: ListRegistration) => (
            <ProjectCard
              projectId={registration.registrant.id}
              key={registration.id}
            />
          )}
        />
      ) : (
        <div className="min-h-100 flex w-full flex-col items-center justify-center">
          <Image
            src="/assets/icons/no-list.svg"
            alt=""
            width={200}
            height={200}
            className="mb-4 h-[200px] w-[200px]"
          />
          <div className="md:flex-row flex flex-col items-center justify-center gap-2">
            <p className="w-100 text-center font-lora italic">
              No results found
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

import { useMemo, useState } from "react";

import Image from "next/image";

import { ListRegistration } from "@/common/api/indexer";
import { CHRONOLOGICAL_SORT_OPTIONS } from "@/common/constants";
import { toChronologicalOrder } from "@/common/lib";
import {
  Filter,
  InfiniteScroll,
  SearchBar,
  SortSelect,
} from "@/common/ui/components";
import { ListCardSkeleton } from "@/modules/lists/components/ListCardSkeleton";

import { ProjectCard } from "./ProjectCard";
import { useProjectsFilters } from "../hooks/useProjectsFilters";

export const ProjectDiscovery = ({
  // TODO: Delete
  setCurrentFilterCategory,
  // TODO: Delete
  filteredRegistrations,
  // TODO: Delete
  setFilteredRegistrations,
}: {
  // TODO: Delete
  setCurrentFilterCategory: (type: string[]) => void;
  // TODO: Delete
  filteredRegistrations: ListRegistration[];
  // TODO: Delete
  setFilteredRegistrations: (type: any) => void;
}) => {
  const [index, setIndex] = useState(1);
  const [search, setSearch] = useState("");

  const { tagList, loading } = useProjectsFilters((type: string) =>
    setCurrentFilterCategory([type]),
  );

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

          <SortSelect
            options={CHRONOLOGICAL_SORT_OPTIONS}
            onValueChange={handleSort}
          />
        </div>
      </div>

      {/* TODO: Use regular pagination from `@/common/ui/components` */}
      {/* Guide: https://ui.shadcn.com/docs/components/pagination */}
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
          size={30}
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

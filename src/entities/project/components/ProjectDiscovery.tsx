import { use, useMemo } from "react";

import Image from "next/image";

import { ListRegistration } from "@/common/api/indexer";
import { CHRONOLOGICAL_SORT_OPTIONS } from "@/common/constants";
import { ChronologicalSortOrderVariant } from "@/common/types";
import {
  Filter,
  Group,
  GroupType,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  SearchBar,
  SortSelect,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

import { ProjectCard } from "./ProjectCard";
import { categories, statuses } from "../constants";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";
import { useProjectLookup } from "../hooks/lookup";

const ProjectLookupPlaceholder = () =>
  Array.from({ length: 6 }, (_, index) => <ProjectCardSkeleton key={index} />);

export const ProjectDiscovery = () => {
  const {
    projectCategoryFilter,
    setProjectCategoryFilter,
    projectLookupPageNumber,
    setProjectLookupPageNumber,
    projectSearchTerm,
    setProjectSearchTerm,
    setProjectSortingOrder,
    projectStatusFilter,
    setProjectStatusFilter,
    isProjectLookupPending,
    projects,
    totalProjectCount,
  } = useProjectLookup({ listId: 1 });

  const tagList = useMemo(
    () => [
      {
        label: "Category",
        options: categories,
        type: GroupType.multiple,

        props: {
          value: projectCategoryFilter,
          onValueChange: setProjectCategoryFilter,
        },
      } as Group<GroupType.multiple>,

      {
        label: "Status",
        options: statuses,
        type: GroupType.single,

        props: {
          value: projectStatusFilter,
          onValueChange: setProjectStatusFilter,
        },
      } as Group<GroupType.single>,
    ],

    [projectCategoryFilter, projectStatusFilter, setProjectCategoryFilter, setProjectStatusFilter],
  );

  const pageNumberButtons = useMemo(() => {
    const totalPages = Math.ceil(totalProjectCount / 30);
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      // Always show first page
      pages.push(1);

      if (projectLookupPageNumber <= 4) {
        // Near start
        pages.push(2, 3, 4, 5, "ellipsis", totalPages);
      } else if (projectLookupPageNumber >= totalPages - 3) {
        // Near end
        pages.push(
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        // Middle
        pages.push(
          "ellipsis",
          projectLookupPageNumber - 1,
          projectLookupPageNumber,
          projectLookupPageNumber + 1,
          "ellipsis",
          totalPages,
        );
      }
    }

    return pages.map((page, i) => (
      <PaginationItem key={i}>
        {page === "ellipsis" ? (
          <PaginationEllipsis />
        ) : (
          <PaginationLink
            onClick={() => setProjectLookupPageNumber(page)}
            className={cn({
              "border-black font-bold": projectLookupPageNumber === page,
            })}
          >
            {page}
          </PaginationLink>
        )}
      </PaginationItem>
    ));
  }, [projectLookupPageNumber, setProjectLookupPageNumber, totalProjectCount]);

  const numberOfPages = useMemo(() => Math.ceil(totalProjectCount / 30), [totalProjectCount]);

  return (
    <div className="flex w-full flex-col px-2 py-10 md:px-10 md:py-12">
      <div className="flex w-full flex-col gap-5">
        <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
          <span>{"All projects"}</span>
          <span className="text-primary-600 font-600 ml-2">{totalProjectCount}</span>
        </div>

        <div className="flex w-full items-center gap-4">
          <SearchBar
            placeholder="Search projects"
            defaultValue={projectSearchTerm}
            onChange={(e) => setProjectSearchTerm(e.target.value.toLowerCase())}
          />

          <Filter groups={tagList} />

          <SortSelect
            options={CHRONOLOGICAL_SORT_OPTIONS}
            onValueChange={(value) => {
              setProjectSortingOrder(value as ChronologicalSortOrderVariant);
            }}
          />
        </div>
      </div>

      <div className="mt-8 grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isProjectLookupPending ? (
          <ProjectLookupPlaceholder />
        ) : (
          projects.map((registration: ListRegistration) => (
            <ProjectCard projectId={registration.registrant.id} key={registration.id} />
          ))
        )}
      </div>
      {numberOfPages > 1 && (
        <Pagination className="mt-[24px]">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setProjectLookupPageNumber((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {pageNumberButtons}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setProjectLookupPageNumber((prev) =>
                    Math.min(prev + 1, Math.ceil(totalProjectCount / 30)),
                  )
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {!totalProjectCount && (
        <div className="min-h-140 flex w-full flex-col items-center justify-center">
          <Image
            src="/assets/icons/no-list.svg"
            alt="No results found"
            width={200}
            height={200}
            className="h-50 w-50 mb-4"
          />

          <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
            <p className="w-100 text-center font-lora italic">{"No results found"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

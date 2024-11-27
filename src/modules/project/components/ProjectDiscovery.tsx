import { useMemo, useState } from "react";

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
import { ListCardSkeleton } from "@/modules/lists/components/ListCardSkeleton";

import { ProjectCard } from "./ProjectCard";
// import { useProjectsFilters } from "../hooks/useProjectsFilters";
import { categories, statuses } from "../constants";
import { useProjectLookup } from "../hooks/lookup";
import { ProjectCategory, ProjectListingStatusVariant } from "../types";

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
    isProjectLookupPending: loading,
    projects,
    totalProjectCount,
  } = useProjectLookup({ listId: 1 });

  console.log(projects.map((project) => project.registrant.id));

  const tagList = useMemo(
    () => [
      {
        label: "Category",
        options: categories,
        type: GroupType.multiple,
        props: {
          value: projectCategoryFilter,
          onValueChange: (value: ProjectCategory[]) => {
            setProjectCategoryFilter(value);
            console.log({ projectCategoryFilter });
          },
        },
      } as Group<GroupType.multiple>,
      {
        label: "Status",
        options: statuses,
        type: GroupType.single,
        props: {
          value: projectStatusFilter,
          onValueChange: (value: ProjectListingStatusVariant) => {
            if (value === "all") {
              setProjectStatusFilter("Approved");
            } else {
              setProjectStatusFilter(value);
            }
          },
        },
      } as Group<GroupType.single>,
    ],
    [
      projectCategoryFilter,
      projectStatusFilter,
      setProjectCategoryFilter,
      setProjectStatusFilter,
    ],
  );
  return (
    <div className="md:px-10 md:py-12 flex w-full flex-col px-2 py-10">
      <div className="flex w-full flex-col gap-5">
        <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
          All projects
          <span
            style={{ color: "#DD3345", marginLeft: "8px", fontWeight: 600 }}
          >
            {totalProjectCount}
          </span>
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
      {loading ? (
        Array.from({ length: 6 }, (_, index) => (
          <ListCardSkeleton key={index} />
        ))
      ) : totalProjectCount ? (
        <>
          <div className="md:grid-cols-2 lg:grid-cols-3 mt-8 grid w-full grid-cols-1 gap-8">
            {projects.map((registration: ListRegistration) => (
              <ProjectCard
                projectId={registration.registrant.id}
                key={registration.id}
              />
            ))}
          </div>
          <Pagination className="mt-[24px]">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setProjectLookupPageNumber((prev) => Math.max(prev - 1, 1))
                  }
                />
              </PaginationItem>
              {(() => {
                const totalPages = Math.ceil(totalProjectCount / 30);
                const pages: (number | "ellipsis")[] = [];

                if (totalPages <= 7) {
                  // Show all pages if total is 7 or less
                  pages.push(
                    ...Array.from({ length: totalPages }, (_, i) => i + 1),
                  );
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
                        className={
                          projectLookupPageNumber === page
                            ? "border-black font-bold"
                            : ""
                        }
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ));
              })()}
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
        </>
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

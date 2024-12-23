import { useMemo, useState } from "react";

import { indexer } from "@/common/api/indexer";
import { toChronologicalOrder } from "@/common/lib";
import { ByListId, ChronologicalSortOrder, ChronologicalSortOrderVariant } from "@/common/types";

import { ProjectCategory, ProjectListingStatusVariant } from "../types";

export type ProjectLookupParams = ByListId & {};

export const useProjectLookup = ({ listId }: ProjectLookupParams) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory[]>([]);

  const [statusFilter, setStatusFilter] = useState<ProjectListingStatusVariant>("Approved");

  const [sortingOrder, setSortingOrder] = useState<ChronologicalSortOrderVariant>(
    ChronologicalSortOrder.recent,
  );

  const {
    data: listRegistrations,
    isLoading,
    error,
  } = indexer.useListRegistrations({
    listId,
    category: categoryFilter.join(","),
    status: statusFilter === "All" ? undefined : statusFilter,
    page: pageNumber,
    search: searchTerm,
  });

  const results = useMemo(() => {
    const oldToRecent = toChronologicalOrder("submitted_at", listRegistrations?.results ?? []);

    return sortingOrder === ChronologicalSortOrder.older ? oldToRecent : oldToRecent.toReversed();
  }, [listRegistrations?.results, sortingOrder]);

  return {
    projectCategoryFilter: categoryFilter,
    projectLookupError: error,
    projectLookupPageNumber: pageNumber,
    projectSearchTerm: searchTerm,
    projectSortingOrder: sortingOrder,
    projectStatusFilter: statusFilter,
    setProjectCategoryFilter: setCategoryFilter,
    setProjectLookupPageNumber: setPageNumber,
    setProjectSearchTerm: setSearchTerm,
    setProjectSortingOrder: setSortingOrder,
    setProjectStatusFilter: setStatusFilter,
    isProjectLookupPending: isLoading,
    projects: results,
    totalProjectCount: listRegistrations?.count ?? 0,
  };
};

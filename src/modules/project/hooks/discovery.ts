import { useState } from "react";

import { indexer } from "@/common/api/indexer";
import {
  ByListId,
  ChronologicalSortOrder,
  ChronologicalSortOrderVariant,
} from "@/common/types";

import { ProjectCategory, ProjectListingStatusVariant } from "../types";

export const useProjectDiscovery = ({ listId }: ByListId) => {
  const [pageSize, setPageSize] = useState(30);
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory[]>([]);

  const [statusFilter, setStatusFilter] =
    useState<ProjectListingStatusVariant>("all");

  /**
   *! INFO: Heads up! Do not apply chronological sorting within this hook.
   *!  Instead, wrap the rendered list of items in `useMemo` within the target component
   *!  with `toReversed` applied to conditionally if `sortingOrder === ChronologicalSortOrder.older`
   */
  const [sortingOrder, setSortingOrder] =
    useState<ChronologicalSortOrderVariant>(ChronologicalSortOrder.recent);

  const {
    data: filteredProjects = [],
    isLoading,
    error,
  } = indexer.useListRegistrations({
    listId,
    category: categoryFilter.join(","),
    status: statusFilter,
    page_size: pageSize,
  });

  const projects = filteredProjects;

  return {
    categoryFilter,
    pageSize,
    sortingOrder,
    statusFilter,
    setCategoryFilter,
    setPageSize,
    setSortingOrder,
    setStatusFilter,
    isLoading,
    projects,
    error,
  };
};

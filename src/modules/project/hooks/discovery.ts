import { useMemo, useState } from "react";

import { indexer } from "@/common/api/indexer";
import { toChronologicalOrder } from "@/common/lib";
import {
  ByListId,
  ChronologicalSortOrder,
  ChronologicalSortOrderVariant,
} from "@/common/types";

import { ProjectCategory, ProjectListingStatusVariant } from "../types";

export const useProjectDiscovery = ({ listId }: ByListId) => {
  const [pageSize, setPageSize] = useState(9);
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory[]>([]);

  const [statusFilter, setStatusFilter] =
    useState<ProjectListingStatusVariant>("all");

  /**
   *! INFO: Heads up! Do not apply reversed chronological sorting within this hook.
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

  const searchResults = useMemo(() => {
    return toChronologicalOrder("submitted_at", filteredProjects);
  }, [filteredProjects]);

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
    projects: searchResults,
    error,
  };
};

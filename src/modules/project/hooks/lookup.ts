import { useCallback, useMemo, useState } from "react";

import { add } from "remeda";

import { indexer } from "@/common/api/indexer";
import { DEFAULT_LOOKUP_PAGE_SIZE } from "@/common/constants";
import { toChronologicalOrder } from "@/common/lib";
import {
  ByListId,
  ChronologicalSortOrder,
  ChronologicalSortOrderVariant,
} from "@/common/types";

import { ProjectCategory, ProjectListingStatusVariant } from "../types";

export type ProjectLookupParams = ByListId & { basicPageSize?: number };

export const useProjectLookup = ({
  listId,
  basicPageSize = DEFAULT_LOOKUP_PAGE_SIZE,
}: ProjectLookupParams) => {
  const [pageSize, setPageSize] = useState(basicPageSize);
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory[]>([]);

  const [statusFilter, setStatusFilter] =
    useState<ProjectListingStatusVariant>("all");

  /**
   *! INFO: Heads up! Do not apply reversed chronological sorting within this hook.
   *!  Instead, wrap the rendered list of items in `useMemo` within the target component
   *!  with `toReversed` applied to conditionally
   *!  if `projectSortingOrder === ChronologicalSortOrder.older`
   */
  const [sortingOrder, setSortingOrder] =
    useState<ChronologicalSortOrderVariant>(ChronologicalSortOrder.recent);

  const {
    data: filteredEntries = [],
    isLoading,
    error,
  } = indexer.useListRegistrations({
    listId,
    category: categoryFilter.join(","),
    status: statusFilter === "all" ? undefined : statusFilter,
    page_size: pageSize,
  });

  const loadMore = useCallback(
    () => setPageSize(add(basicPageSize)),
    [basicPageSize],
  );

  const searchResults = useMemo(() => {
    return toChronologicalOrder("submitted_at", filteredEntries);
  }, [filteredEntries]);

  return {
    projectCategoryFilter: categoryFilter,
    projectLookupError: error,
    projectLookupPageSize: pageSize,
    projectSortingOrder: sortingOrder,
    projectStatusFilter: statusFilter,
    setProjectCategoryFilter: setCategoryFilter,
    setProjectSortingOrder: setSortingOrder,
    setProjectStatusFilter: setStatusFilter,
    isProjectLookupPending: isLoading,
    projects: searchResults,
    loadMoreProjects: loadMore,
  };
};

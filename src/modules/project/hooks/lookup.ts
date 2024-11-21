import { useCallback, useMemo, useState } from "react";

import { add, values } from "remeda";

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
  const [page, setPage] = useState(1);

  const loadMore = useCallback(() => {
    setPage(add(1));
  }, []);

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
    data: listRegistrations,
    isLoading,
    error,
  } = indexer.useListRegistrationsInfinite({
    listId,
    category: categoryFilter.join(","),
    status: statusFilter === "all" ? undefined : statusFilter,
    page,
  });

  const searchResults = useMemo(() => {
    return toChronologicalOrder(
      "submitted_at",
      listRegistrations?.results ?? [],
    );
  }, [listRegistrations]);

  return {
    projectCategoryFilter: categoryFilter,
    projectLookupError: error,
    projectSortingOrder: sortingOrder,
    projectStatusFilter: statusFilter,
    setProjectCategoryFilter: setCategoryFilter,
    setProjectSortingOrder: setSortingOrder,
    setProjectStatusFilter: setStatusFilter,
    isProjectLookupPending: isLoading,
    projects: searchResults,
    loadMoreProjects: loadMore,
    totalProjectCount: listRegistrations?.count ?? 999,
  };
};

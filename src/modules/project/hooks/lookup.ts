import { useMemo, useState } from "react";

import { indexer } from "@/common/api/indexer";
import { toChronologicalOrder } from "@/common/lib";
import {
  ByListId,
  ChronologicalSortOrder,
  ChronologicalSortOrderVariant,
} from "@/common/types";

import { ProjectCategory, ProjectListingStatusVariant } from "../types";

export type ProjectLookupParams = ByListId & {};

export const useProjectLookup = ({ listId }: ProjectLookupParams) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory[]>([]);

  const [statusFilter, setStatusFilter] =
    useState<ProjectListingStatusVariant>("Approved");

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
  } = indexer.useListRegistrations({
    listId,
    category: categoryFilter.join(","),
    status: statusFilter === "all" ? undefined : statusFilter,
    page: pageNumber,
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
    projectLookupPageNumber: pageNumber,
    projectSortingOrder: sortingOrder,
    projectStatusFilter: statusFilter,
    setProjectCategoryFilter: setCategoryFilter,
    setProjectLookupPageNumber: setPageNumber,
    setProjectSortingOrder: setSortingOrder,
    setProjectStatusFilter: setStatusFilter,
    isProjectLookupPending: isLoading,
    projects: searchResults,
    totalProjectCount: listRegistrations?.count ?? 0,
  };
};

import { useCallback, useMemo, useState } from "react";

import { indexer } from "@/common/api/indexer";
import { oldToRecent } from "@/common/lib";
import { ByListId, ChronologicalSortOrder, ChronologicalSortOrderVariant } from "@/common/types";
import { AccountCategory, type AccountListRegistrationStatusVariant } from "@/entities/_shared";

export type ListRegistrationLookupParams = ByListId & {};

export const useListRegistrationLookup = ({ listId }: ListRegistrationLookupParams) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<AccountCategory[]>([]);

  const [statusFilter, setStatusFilter] =
    useState<AccountListRegistrationStatusVariant>("Approved");

  const [sortingOrder, setSortingOrder] = useState<ChronologicalSortOrderVariant>(
    ChronologicalSortOrder.recent,
  );

  const {
    data: indexerQueryData,
    isLoading,
    error,
  } = indexer.useListRegistrations({
    listId,
    category: categoryFilter.join(","),
    status: statusFilter === "All" ? undefined : statusFilter,
    page: currentPageNumber,
    search: searchTerm,
  });

  const results = useMemo(() => {
    const oldToRecentResults = oldToRecent("submitted_at", indexerQueryData?.results ?? []);

    return sortingOrder === ChronologicalSortOrder.older
      ? oldToRecentResults
      : oldToRecentResults.toReversed();
  }, [indexerQueryData?.results, sortingOrder]);

  const handleSearchTermUpdate = useCallback((input: typeof searchTerm) => {
    setSearchTerm(input);
    setCurrentPageNumber(1);
  }, []);

  return {
    isPending: isLoading,
    categoryFilter,
    currentPageNumber,
    results,
    searchTerm,
    sortingOrder,
    statusFilter,
    totalCount: indexerQueryData?.count ?? 0,
    setCategoryFilter,
    setCurrentPageNumber,
    setSearchTerm: handleSearchTermUpdate,
    setSortingOrder,
    setStatusFilter,
    error,
  };
};

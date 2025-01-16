import { useState } from "react";

import { ByPotId, indexer } from "@/common/api/indexer";

export type PotPayoutLookupParams = ByPotId & {
  pageSize?: number;
};

export const usePotPayoutLookup = ({ potId, pageSize = 10 }: PotPayoutLookupParams) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string | undefined>("");

  const {
    isLoading,
    data,
    mutate: refetchData,
    error,
  } = indexer.usePotPayouts({
    potId,
    page_size: pageSize,
    page: pageNumber,
    search: searchTerm,
  });

  return {
    isPayoutListLoading: isLoading,
    setPayoutSearchTerm: setSearchTerm,
    setPayoutPageNumber: setPageNumber,
    payouts: data?.results,
    refetchPayouts: refetchData,
    payoutsError: error,
    payoutPageNumber: pageNumber,
    payoutSearchTerm: searchTerm,
    totalPayoutCount: data?.count ?? 0,
  };
};

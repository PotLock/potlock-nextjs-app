import { useMemo, useState } from "react";

import { ByPotId, indexer } from "@/common/api/indexer";

export type PotPayoutLookupParams = ByPotId & {};

export const usePotPayoutLookup = ({ potId }: PotPayoutLookupParams) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string | undefined>("");

  const {
    data: potPayouts,
    isLoading,
    error,
  } = indexer.usePotPayouts({
    potId,
    page_size: 10,
    page: pageNumber,
    search: searchTerm,
  });

  const results = useMemo(() => {
    return potPayouts?.results?.map((payout) => ({
      project_id: payout?.recipient?.id,
      id: payout?.id,
      amount: payout?.amount,
    }));
  }, [potPayouts]);

  return {
    payoutsError: error,
    payouts: results,
    isPayoutListLoading: isLoading,
    setPayoutSearchTerm: setSearchTerm,
    setPayoutPageNumber: setPageNumber,
    payoutPageNumber: pageNumber,
    payoutSearchTerm: searchTerm,
    totalPayoutCount: potPayouts?.count ?? 0,
  };
};

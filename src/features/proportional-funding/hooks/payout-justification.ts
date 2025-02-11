import { useCallback } from "react";

import type { ByPotId } from "@/common/api/indexer";
import { useVotingRoundResults } from "@/entities/voting-round";

import { submitPayoutJustification } from "../model/effects";

export const useProportionalFundingPayoutJustification = ({ potId }: ByPotId) => {
  const votingRound = useVotingRoundResults({ potId });

  const submit = useCallback(() => {
    if (votingRound.data !== undefined) {
      submitPayoutJustification({ potId, data: votingRound.data });
    }
  }, [potId, votingRound]);

  return {
    submit,
  };
};

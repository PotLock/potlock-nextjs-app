import { useCallback, useMemo } from "react";

import type { ByPotId } from "@/common/api/indexer";
import { potContractHooks } from "@/common/contracts/core/pot";
import { useWalletUserSession } from "@/common/wallet";
import { useVotingRoundResults } from "@/entities/voting-round";

import { attachPayoutJustification } from "../model/effects";

export type PFPayoutJustificationLookupParams = ByPotId & {};

export const usePFPayoutJustification = ({ potId }: PFPayoutJustificationLookupParams) => {
  const viewer = useWalletUserSession();
  const votingRound = useVotingRoundResults({ potId });
  const { data: potPayoutChallengeList } = potContractHooks.usePayoutChallenges({ potId });

  const isAttached = useMemo(() => {
    return potPayoutChallengeList?.some((challenge) => {
      return challenge.challenger_id === viewer.accountId;
    });
  }, [potPayoutChallengeList, viewer.accountId]);

  const submit = useCallback(() => {
    if (viewer.isSignedIn && votingRound.data !== undefined) {
      attachPayoutJustification({
        potId,
        data: votingRound.data,
        challengerAccountId: viewer.accountId,
      });
    }
  }, [potId, viewer.accountId, viewer.isSignedIn, votingRound.data]);

  return !votingRound.isLoading && votingRound.data === undefined
    ? {
        isLoading: false as const,
        submit: undefined,
      }
    : {
        isLoading: votingRound.isLoading,
        submit,
      };
};

import { useCallback, useMemo } from "react";

import { isNonNullish } from "remeda";

import type { ByPotId } from "@/common/api/indexer";
import { type Challenge, potContractHooks } from "@/common/contracts/core/pot";
import { useWalletUserSession } from "@/common/wallet";
import { usePotAuthorization } from "@/entities/pot";
import { useVotingRoundResults } from "@/entities/voting-round";

import { publishPayoutJustification } from "../model/effects";

export type PFPayoutJustificationLookupParams = ByPotId & {};

export const challengeToJustification = (challenge: Challenge) => {
  try {
    const data = JSON.parse(challenge.reason) as Record<string, unknown>;

    return "PayoutJustification" in data && typeof data.PayoutJustification === "string"
      ? data.PayoutJustification
      : null;
  } catch {
    return null;
  }
};

export const usePFPayoutJustification = ({ potId }: PFPayoutJustificationLookupParams) => {
  const viewer = useWalletUserSession();
  const viewerPower = usePotAuthorization({ potId, accountId: viewer.accountId });
  const votingRound = useVotingRoundResults({ potId });

  const { isLoading: isPayoutChallengeListLoading, data: potPayoutChallengeList } =
    potContractHooks.usePayoutChallenges({ potId });

  const currentJustification = useMemo(
    () => potPayoutChallengeList?.map(challengeToJustification).find(isNonNullish),
    [potPayoutChallengeList],
  );

  const isPublished = useMemo(() => isNonNullish(currentJustification), [currentJustification]);

  const publish = useCallback(() => {
    if (viewer.isSignedIn && votingRound.data !== undefined) {
      publishPayoutJustification({
        potId,
        data: votingRound.data,
        challengerAccountId: viewer.accountId,
      });
    }
  }, [potId, viewer.accountId, viewer.isSignedIn, votingRound.data]);

  return !viewer.isSignedIn || (!votingRound.isLoading && votingRound.data === undefined)
    ? {
        isLoading: false as const,
        isPublished: false,
        data: undefined,
        publish: undefined,
      }
    : {
        isLoading: votingRound.isLoading || isPayoutChallengeListLoading,
        isPublished,
        data: currentJustification,
        publish: isPublished || !viewerPower.isAdminOrGreater ? undefined : publish,
      };
};

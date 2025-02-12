import { useCallback, useMemo } from "react";

import { isNonNullish } from "remeda";

import type { ByPotId } from "@/common/api/indexer";
import { potContractHooks } from "@/common/contracts/core/pot";
import { useWalletUserSession } from "@/common/wallet";
import { usePotAuthorization } from "@/entities/pot";
import { useVotingRoundResults } from "@/entities/voting-round";

import { publishPayoutJustification } from "../model/effects";
import { challengeToJustification } from "../utils/converters";

export type PFPayoutJustificationParams = ByPotId & {
  onPublishSuccess?: () => void;
  onPublishError?: (message: string) => void;
};

export const usePFPayoutJustification = ({
  potId,
  onPublishSuccess,
  onPublishError,
}: PFPayoutJustificationParams) => {
  const viewer = useWalletUserSession();
  const viewerPower = usePotAuthorization({ potId, accountId: viewer.accountId });
  const votingRound = useVotingRoundResults({ potId });

  const {
    isLoading: isPayoutChallengeListLoading,
    data: potPayoutChallengeList,
    mutate: refetchPayoutChallenges,
  } = potContractHooks.usePayoutChallenges({ potId });

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
      })
        .then(() => {
          onPublishSuccess?.();
          refetchPayoutChallenges();
        })
        .catch((error) => {
          console.error(error);
          onPublishError?.(error.message);
        });
    }
  }, [
    onPublishError,
    onPublishSuccess,
    potId,
    refetchPayoutChallenges,
    viewer.accountId,
    viewer.isSignedIn,
    votingRound.data,
  ]);

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

import { useCallback, useMemo } from "react";

import { isNonNullish } from "remeda";
import useSWR from "swr";

import type { ByPotId } from "@/common/api/indexer";
import { potContractHooks } from "@/common/contracts/core/pot";
import { useWalletUserSession } from "@/common/wallet";
import { usePotAuthorization } from "@/entities/pot";
import { useVotingRoundResults } from "@/entities/voting-round";

import { publishPayoutJustification } from "../model/effects";
import type { PFPayoutJustificationV1 } from "../model/types";
import { pfPayoutChallengeToJustificationUrl } from "../utils/converters";

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

  const documentUrl = useMemo(
    () => potPayoutChallengeList?.map(pfPayoutChallengeToJustificationUrl).find(isNonNullish),
    [potPayoutChallengeList],
  );

  const { isLoading: isDocumentLoading, data: document } = useSWR(
    ["payout-justification", documentUrl],

    ([_queryKeyHead, urlQueryKey]) =>
      urlQueryKey === undefined
        ? undefined
        : fetch(urlQueryKey)
            .then((res) => res.json())
            .then((data: PFPayoutJustificationV1) => data),
  );

  const isLoading = votingRound.isLoading || isPayoutChallengeListLoading || isDocumentLoading;

  const publish = useCallback(() => {
    if (viewer.isSignedIn && votingRound.data !== undefined) {
      publishPayoutJustification({
        potId,
        votingRoundResult: votingRound.data,
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
        data: undefined,
        publish: undefined,
      }
    : {
        isLoading,
        data: document,

        publish:
          !isLoading && document === undefined && viewerPower.isAdminOrGreater
            ? publish
            : undefined,
      };
};

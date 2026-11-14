import { useMemo } from "react";

import {
  LISTS_CONTRACT_ACCOUNT_ID,
  PLATFORM_NAME,
  SOCIAL_DB_CONTRACT_ACCOUNT_ID,
} from "@/common/_config";
import { ProposalStatus, sputnikDaoHooks } from "@/common/contracts/sputnikdao2";
import type { ByAccountId, ConditionalActivation } from "@/common/types";

export const useDaoRegistrationProposalStatus = ({
  enabled,
  accountId,
}: ByAccountId & ConditionalActivation) => {
  const {
    isProposalListLoading: isRecentProposalListLoading,
    proposals: recentProposals,
    proposalsError,
    refetchProposals: refetchRecentProposals,
  } = sputnikDaoHooks.useProposalLookup({
    enabled,
    accountId,
    fromIndex: 0,
    limit: 10,
    kind: "FunctionCall",
    status: ProposalStatus.InProgress,
    receiverAccountIds: [LISTS_CONTRACT_ACCOUNT_ID, SOCIAL_DB_CONTRACT_ACCOUNT_ID],
    methodNames: ["register_batch", "set"],
    initialSearchTerm: PLATFORM_NAME,
  });

  const isLoading = useMemo(
    () => recentProposals === undefined && isRecentProposalListLoading,
    [recentProposals, isRecentProposalListLoading],
  );

  const isSubmitted = useMemo(() => (recentProposals ?? []).length > 0, [recentProposals]);

  return {
    isLoading,
    entries: recentProposals,
    error: proposalsError,
    isSubmitted,
    refetch: refetchRecentProposals,
  };
};

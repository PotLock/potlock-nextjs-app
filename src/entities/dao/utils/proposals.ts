import { SOCIAL_APP_LINK_URL } from "@/common/_config";
import type { ByProposalId } from "@/common/contracts/sputnikdao2";
import type { AccountId } from "@/common/types";

export const daoProposalViewUrlById = ({
  daoAccountId,
  proposalId,
}: ByProposalId & { daoAccountId: AccountId }) =>
  SOCIAL_APP_LINK_URL +
  "/astraplusplus.ndctools.near/widget/home" +
  "?page=dao" +
  "&tab=proposals" +
  `&daoId=${daoAccountId}&proposalId=${proposalId}`;

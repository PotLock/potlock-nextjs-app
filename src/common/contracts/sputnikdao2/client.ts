import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import type { ByAccountId } from "@/common/types";

import type { Policy, ProposalOutput } from "./types";

export const get_policy = ({ accountId }: ByAccountId) =>
  nearProtocolClient.naxiosInstance
    .contractApi({ contractId: accountId })
    .view<{}, Policy>("get_policy");

export type GetProposalsArgs = {
  from_index: number;
  limit: number;
};

/**
 * Returns proposals in paginated view.
 */
export const get_proposals = ({ accountId, args }: ByAccountId & { args: GetProposalsArgs }) =>
  nearProtocolClient.naxiosInstance
    .contractApi({ contractId: accountId })
    .view<typeof args, ProposalOutput[]>("get_proposals", { args });

import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import { FULL_TGAS } from "@/common/constants";
import type { ByAccountId, IndivisibleUnits } from "@/common/types";

import type { Policy, ProposalId, ProposalInput, ProposalOutput } from "./types";

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

export type AddProposalArgs = {
  proposal: ProposalInput;
};

export const add_proposal = ({
  accountId,
  proposalBond,
  callbackUrl = window.location.href,
  args,
}: ByAccountId & { proposalBond: IndivisibleUnits; callbackUrl?: string } & {
  args: AddProposalArgs;
}) =>
  nearProtocolClient.naxiosInstance
    .contractApi({ contractId: accountId })
    .call<typeof args, ProposalId>("add_proposal", {
      args,
      deposit: proposalBond,
      gas: FULL_TGAS,
      callbackUrl,
    });

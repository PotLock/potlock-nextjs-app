import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import type { ByAccountId } from "@/common/types";

export const get_policy = ({ accountId }: ByAccountId) =>
  nearProtocolClient.naxiosInstance
    .contractApi({ contractId: accountId })
    .view<any, { proposal_bond?: string }>("get_policy");

import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import type { ByAccountId } from "@/common/types";

import type { Policy } from "./types";

export const get_policy = ({ accountId }: ByAccountId) =>
  nearProtocolClient.naxiosInstance
    .contractApi({ contractId: accountId })
    .view<{}, Policy>("get_policy");

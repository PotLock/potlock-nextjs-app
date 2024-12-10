import { VOTING_CONTRACT_ACCOUNT_ID } from "@/common/_config";

import { createVotingClient } from "./client";

export const votingClient = createVotingClient(VOTING_CONTRACT_ACCOUNT_ID);

import { VOTING_CONTRACT_ACCOUNT_ID } from "@/common/_config";

import { createVotingClient } from "./client";

export * as VotingContract from "./interfaces";

export const votingClient = createVotingClient(VOTING_CONTRACT_ACCOUNT_ID);

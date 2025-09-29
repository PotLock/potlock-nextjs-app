import * as sputnikDaoClient from "./client";
import * as sputnikDaoHooks from "./hooks";
import * as sputnikDaoQueries from "./queries";
import type { ProposalId } from "./types";

export type * from "./hooks";
export * from "./types";

export { sputnikDaoClient, sputnikDaoHooks, sputnikDaoQueries };

export interface ByProposalId {
  proposalId: ProposalId;
}

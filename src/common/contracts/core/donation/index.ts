import * as donationContractClient from "./client";
import * as donationContractHooks from "./hooks";

export type * from "./hooks";
export * from "./interfaces";
export type { DirectDonateResult, DirectBatchDonateResult } from "./client";

export { donationContractClient, donationContractHooks };

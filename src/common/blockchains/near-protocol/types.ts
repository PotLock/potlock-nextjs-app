import type { ExecutionOutcome, ExecutionStatus } from "near-api-js/lib/providers/provider";

export type InformativeSuccessfulExecutionOutcome = ExecutionOutcome & {
  status: ExecutionStatus & { SuccessValue: string };
};

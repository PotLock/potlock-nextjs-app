import axios from "axios";

import { RPC_NODE_URL } from "@/common/api/near";
import { AccountId } from "@/common/types";

export type TxExecutionStatus =
  | "NONE"
  | "INCLUDED"
  | "EXECUTED_OPTIMISTIC"
  | "INCLUDED_FINAL"
  | "EXECUTED"
  | "FINAL";

/**
 * @deprecated use `nearRpc.txStatus()`
 */
export const getTransactionStatus = ({
  wait_until = "EXECUTED_OPTIMISTIC",
  ...params
}: {
  tx_hash: string;
  sender_account_id: AccountId;
  wait_until?: TxExecutionStatus;
}) =>
  axios.post(RPC_NODE_URL, {
    jsonrpc: "2.0",
    id: "dontcare",
    method: "tx",
    params: { wait_until, ...params },
  });

import { useMemo } from "react";

import { pick } from "remeda";
import useSWR from "swr";

import { IS_CLIENT } from "@/common/constants";
import type { ByAccountId, ConditionalActivation } from "@/common/types";

import * as contractClient from "./client";
import type { ProposalStatus } from "./types";

export const useProposals = ({
  enabled = true,
  accountId,
  ...params
}: ConditionalActivation & ByAccountId & contractClient.GetProposalsArgs) =>
  useSWR(["get_proposals", accountId, params], ([_queryKeyHead, accountIdKey, paramsKey]) =>
    !enabled || !IS_CLIENT
      ? undefined
      : contractClient.get_proposals({
          accountId: accountIdKey,
          args: pick(paramsKey, ["from_index", "limit"]),
        }),
  );

type DaoProposalLookupParams = ByAccountId &
  ConditionalActivation & {
    fromIndex: number;
    limit: number;
    initialSearchTerm?: string;
    kind?: "Vote" | "FunctionCall";
    status?: ProposalStatus;
    receiverAccountIds?: string[];
    methodNames?: string[];
  };

export const useProposalLookup = ({
  enabled = true,
  accountId,
  fromIndex,
  limit,
  initialSearchTerm = "",
  ...params
}: DaoProposalLookupParams) => {
  const {
    isLoading,
    data,
    error,
    mutate: refetchData,
  } = useProposals({
    enabled,
    accountId,
    from_index: fromIndex,
    limit,
  });

  const results = useMemo(() => {
    const filtered = data?.filter(({ kind, status }) => {
      if (params.status === undefined || status === params.status) {
        if (params.kind === undefined || (typeof kind === "string" && kind === params.kind)) {
          return true;
        } else if (typeof kind === "object" && params.kind in kind) {
          switch (params.kind) {
            case "FunctionCall": {
              const { receiver_id, actions } = kind.FunctionCall;

              return (
                (params.receiverAccountIds === undefined ||
                  params.receiverAccountIds.includes(receiver_id)) &&
                (params.methodNames === undefined ||
                  (Array.isArray(params.methodNames) &&
                    actions.some(({ method_name }) =>
                      (params.methodNames as string[]).includes(method_name),
                    )))
              );
            }

            default: {
              return true;
            }
          }
        } else return false;
      } else return false;
    });

    return filtered?.filter(({ description }) =>
      description.toLowerCase().includes(initialSearchTerm.toLowerCase()),
    );
  }, [
    data,
    initialSearchTerm,
    params.kind,
    params.methodNames,
    params.receiverAccountIds,
    params.status,
  ]);

  return {
    isProposalListLoading: isLoading,
    proposals: results,
    proposalsError: error,
    refetchProposals: refetchData,
  };
};

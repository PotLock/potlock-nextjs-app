import {
  getAccountsAccountIdBalancesFtContractAccountIdHistory500Schema,
  getAccountsAccountIdBalancesFtContractAccountIdHistoryPathParamsSchema,
  getAccountsAccountIdBalancesFtContractAccountIdHistoryQueryParamsSchema,
  getAccountsAccountIdBalancesFtContractAccountIdHistoryQueryResponseSchema,
} from "./getAccountsAccountIdBalancesFtContractAccountIdHistorySchema";
import {
  getAccountsAccountIdBalancesFtContractAccountId500Schema,
  getAccountsAccountIdBalancesFtContractAccountIdPathParamsSchema,
  getAccountsAccountIdBalancesFtContractAccountIdQueryParamsSchema,
  getAccountsAccountIdBalancesFtContractAccountIdQueryResponseSchema,
} from "./getAccountsAccountIdBalancesFtContractAccountIdSchema";
import {
  getAccountsAccountIdBalancesFt500Schema,
  getAccountsAccountIdBalancesFtPathParamsSchema,
  getAccountsAccountIdBalancesFtQueryParamsSchema,
  getAccountsAccountIdBalancesFtQueryResponseSchema,
} from "./getAccountsAccountIdBalancesFtSchema";
import {
  getAccountsAccountIdBalancesNearHistory500Schema,
  getAccountsAccountIdBalancesNearHistoryPathParamsSchema,
  getAccountsAccountIdBalancesNearHistoryQueryParamsSchema,
  getAccountsAccountIdBalancesNearHistoryQueryResponseSchema,
} from "./getAccountsAccountIdBalancesNearHistorySchema";
import {
  getAccountsAccountIdBalancesNear500Schema,
  getAccountsAccountIdBalancesNearPathParamsSchema,
  getAccountsAccountIdBalancesNearQueryParamsSchema,
  getAccountsAccountIdBalancesNearQueryResponseSchema,
} from "./getAccountsAccountIdBalancesNearSchema";
import {
  getAccountsAccountIdNftContractAccountId500Schema,
  getAccountsAccountIdNftContractAccountIdPathParamsSchema,
  getAccountsAccountIdNftContractAccountIdQueryParamsSchema,
  getAccountsAccountIdNftContractAccountIdQueryResponseSchema,
} from "./getAccountsAccountIdNftContractAccountIdSchema";
import {
  getAccountsAccountIdNft500Schema,
  getAccountsAccountIdNftPathParamsSchema,
  getAccountsAccountIdNftQueryParamsSchema,
  getAccountsAccountIdNftQueryResponseSchema,
} from "./getAccountsAccountIdNftSchema";
import {
  getNep141MetadataContractAccountId500Schema,
  getNep141MetadataContractAccountIdPathParamsSchema,
  getNep141MetadataContractAccountIdQueryParamsSchema,
  getNep141MetadataContractAccountIdQueryResponseSchema,
} from "./getNep141MetadataContractAccountIdSchema";
import {
  getNep171MetadataContractAccountId500Schema,
  getNep171MetadataContractAccountIdPathParamsSchema,
  getNep171MetadataContractAccountIdQueryParamsSchema,
  getNep171MetadataContractAccountIdQueryResponseSchema,
} from "./getNep171MetadataContractAccountIdSchema";
import {
  getNftContractAccountIdTokenIdHistory500Schema,
  getNftContractAccountIdTokenIdHistoryPathParamsSchema,
  getNftContractAccountIdTokenIdHistoryQueryParamsSchema,
  getNftContractAccountIdTokenIdHistoryQueryResponseSchema,
} from "./getNftContractAccountIdTokenIdHistorySchema";
import {
  getNftContractAccountIdTokenId500Schema,
  getNftContractAccountIdTokenIdPathParamsSchema,
  getNftContractAccountIdTokenIdQueryParamsSchema,
  getNftContractAccountIdTokenIdQueryResponseSchema,
} from "./getNftContractAccountIdTokenIdSchema";

export const operations = {
  "get_nft-contract-account-id-token-id": {
    request: undefined,
    parameters: {
      path: getNftContractAccountIdTokenIdPathParamsSchema,
      query: getNftContractAccountIdTokenIdQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: getNftContractAccountIdTokenIdQueryResponseSchema,
      500: getNftContractAccountIdTokenId500Schema,
    },
  },
  "get_nft-contract-account-id-token-id-history": {
    request: undefined,
    parameters: {
      path: getNftContractAccountIdTokenIdHistoryPathParamsSchema,
      query: getNftContractAccountIdTokenIdHistoryQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: getNftContractAccountIdTokenIdHistoryQueryResponseSchema,
      500: getNftContractAccountIdTokenIdHistory500Schema,
    },
  },
  "get_accounts-account-id-nft": {
    request: undefined,
    parameters: {
      path: getAccountsAccountIdNftPathParamsSchema,
      query: getAccountsAccountIdNftQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: getAccountsAccountIdNftQueryResponseSchema,
      500: getAccountsAccountIdNft500Schema,
    },
  },
  "get_accounts-account-id-nft-contract-account-id": {
    request: undefined,
    parameters: {
      path: getAccountsAccountIdNftContractAccountIdPathParamsSchema,
      query: getAccountsAccountIdNftContractAccountIdQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: getAccountsAccountIdNftContractAccountIdQueryResponseSchema,
      500: getAccountsAccountIdNftContractAccountId500Schema,
    },
  },
  "get_accounts-account-id-balances-ft": {
    request: undefined,
    parameters: {
      path: getAccountsAccountIdBalancesFtPathParamsSchema,
      query: getAccountsAccountIdBalancesFtQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: getAccountsAccountIdBalancesFtQueryResponseSchema,
      500: getAccountsAccountIdBalancesFt500Schema,
    },
  },
  "get_accounts-account-id-balances-ft-contract-account-id": {
    request: undefined,
    parameters: {
      path: getAccountsAccountIdBalancesFtContractAccountIdPathParamsSchema,
      query: getAccountsAccountIdBalancesFtContractAccountIdQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: getAccountsAccountIdBalancesFtContractAccountIdQueryResponseSchema,
      500: getAccountsAccountIdBalancesFtContractAccountId500Schema,
    },
  },
  "get_accounts-account-id-balances-ft-contract-account-id-history": {
    request: undefined,
    parameters: {
      path: getAccountsAccountIdBalancesFtContractAccountIdHistoryPathParamsSchema,
      query:
        getAccountsAccountIdBalancesFtContractAccountIdHistoryQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: getAccountsAccountIdBalancesFtContractAccountIdHistoryQueryResponseSchema,
      500: getAccountsAccountIdBalancesFtContractAccountIdHistory500Schema,
    },
  },
  "get_accounts-account-id-balances-near": {
    request: undefined,
    parameters: {
      path: getAccountsAccountIdBalancesNearPathParamsSchema,
      query: getAccountsAccountIdBalancesNearQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: getAccountsAccountIdBalancesNearQueryResponseSchema,
      500: getAccountsAccountIdBalancesNear500Schema,
    },
  },
  "get_accounts-account-id-balances-near-history": {
    request: undefined,
    parameters: {
      path: getAccountsAccountIdBalancesNearHistoryPathParamsSchema,
      query: getAccountsAccountIdBalancesNearHistoryQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: getAccountsAccountIdBalancesNearHistoryQueryResponseSchema,
      500: getAccountsAccountIdBalancesNearHistory500Schema,
    },
  },
  "get_nep141-metadata-contract-account-id": {
    request: undefined,
    parameters: {
      path: getNep141MetadataContractAccountIdPathParamsSchema,
      query: getNep141MetadataContractAccountIdQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: getNep141MetadataContractAccountIdQueryResponseSchema,
      500: getNep141MetadataContractAccountId500Schema,
    },
  },
  "get_nep171-metadata-contract-account-id": {
    request: undefined,
    parameters: {
      path: getNep171MetadataContractAccountIdPathParamsSchema,
      query: getNep171MetadataContractAccountIdQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: getNep171MetadataContractAccountIdQueryResponseSchema,
      500: getNep171MetadataContractAccountId500Schema,
    },
  },
} as const;
export const paths = {
  "/NFT/{contract_account_id}/{token_id}": {
    get: operations["get_nft-contract-account-id-token-id"],
  },
  "/NFT/{contract_account_id}/{token_id}/history": {
    get: operations["get_nft-contract-account-id-token-id-history"],
  },
  "/accounts/{account_id}/NFT": {
    get: operations["get_accounts-account-id-nft"],
  },
  "/accounts/{account_id}/NFT/{contract_account_id}": {
    get: operations["get_accounts-account-id-nft-contract-account-id"],
  },
  "/accounts/{account_id}/balances/FT": {
    get: operations["get_accounts-account-id-balances-ft"],
  },
  "/accounts/{account_id}/balances/FT/{contract_account_id}": {
    get: operations["get_accounts-account-id-balances-ft-contract-account-id"],
  },
  "/accounts/{account_id}/balances/FT/{contract_account_id}/history": {
    get: operations[
      "get_accounts-account-id-balances-ft-contract-account-id-history"
    ],
  },
  "/accounts/{account_id}/balances/NEAR": {
    get: operations["get_accounts-account-id-balances-near"],
  },
  "/accounts/{account_id}/balances/NEAR/history": {
    get: operations["get_accounts-account-id-balances-near-history"],
  },
  "/nep141/metadata/{contract_account_id}": {
    get: operations["get_nep141-metadata-contract-account-id"],
  },
  "/nep171/metadata/{contract_account_id}": {
    get: operations["get_nep171-metadata-contract-account-id"],
  },
} as const;

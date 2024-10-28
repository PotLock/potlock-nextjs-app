import { getEnvConfig } from "./env";

export const {
  network: NETWORK,

  contractMetadata: {
    version: CONTRACT_SOURCECODE_VERSION,
    repoUrl: CONTRACT_SOURCECODE_REPO_URL,
  },

  donation: {
    contract: { accountId: DONATION_CONTRACT_ACCOUNT_ID },
  },

  lists: {
    contract: { accountId: LISTS_CONTRACT_ACCOUNT_ID },
  },

  potFactory: {
    contract: { accountId: POT_FACTORY_CONTRACT_ACCOUNT_ID },
  },

  sybil: {
    app: { url: SYBIL_APP_LINK_URL },
    contract: { accountId: SYBIL_CONTRACT_ACCOUNT_ID },
  },
} = getEnvConfig();

export const SOCIAL_DB_CONTRACT_ID =
  NETWORK === "mainnet" ? "social.near" : "v1.social08.testnet";

/**
 * Docs: https://dev.potlock.io/api/schema/swagger-ui/
 */
export const INDEXER_API_ENDPOINT =
  NETWORK === "mainnet"
    ? "https://dev.potlock.io"
    : "https://test-dev.potlock.io";

export const BLOCKCHAIN_EXPLORER_TX_ENDPOINT_URL =
  NETWORK === "mainnet"
    ? "https://nearblocks.io/txns"
    : "https://testnet.nearblocks.io/txns";

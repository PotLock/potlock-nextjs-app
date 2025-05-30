import { getEnvConfig } from "./env";

export const {
  platformName: PLATFORM_NAME,
  envTag: ENV_TAG,
  network: NETWORK,

  indexer: {
    api: { endpointUrl: INDEXER_API_ENDPOINT_URL },
  },

  contractMetadata: { version: CONTRACT_SOURCECODE_VERSION, repoUrl: CONTRACT_SOURCECODE_REPO_URL },

  core: {
    campaigns: {
      contract: { accountId: CAMPAIGNS_CONTRACT_ACCOUNT_ID },
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

    voting: {
      contract: { accountId: VOTING_CONTRACT_ACCOUNT_ID },
    },
  },

  social: {
    app: { url: SOCIAL_APP_LINK_URL },
    contract: { accountId: SOCIAL_DB_CONTRACT_ACCOUNT_ID },
  },

  deFi: {
    metapool: {
      liquidStakingContract: { accountId: METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID },
    },

    refFinance: {
      exchangeContract: { accountId: REF_EXCHANGE_CONTRACT_ACCOUNT_ID },
    },
  },

  features: FEATURE_REGISTRY,
} = getEnvConfig();

export const BLOCKCHAIN_EXPLORER_TX_ENDPOINT_URL =
  NETWORK === "mainnet" ? "https://nearblocks.io/txns" : "https://testnet.nearblocks.io/txns";

export const IPFS_GATEWAY_URL = process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL;

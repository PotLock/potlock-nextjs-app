import { getEnvConfig } from "./env";

export const {
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
    contract: { accountId: SOCIAL_CONTRACT_ACCOUNT_ID },
  },

  deFi: {
    metapool: {
      lockupStakeContract: { accountId: METAPOOL_LOCKUP_STAKE_CONTRACT_ACCOUNT_ID },
    },

    refFinance: {
      exchangeContract: { accountId: REF_EXCHANGE_CONTRACT_ACCOUNT_ID },
    },
  },

  features: FEATURE_REGISTRY,
} = getEnvConfig();

export const BLOCKCHAIN_EXPLORER_TX_ENDPOINT_URL =
  NETWORK === "mainnet" ? "https://nearblocks.io/txns" : "https://testnet.nearblocks.io/txns";

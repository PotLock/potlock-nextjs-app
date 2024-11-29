import { EnvConfig, FeatureId } from "@/common/types";

export const envConfig: EnvConfig = {
  network: "mainnet" as const,

  contractMetadata: {
    version: "0.1.0",
    repoUrl: "https://github.com/PotLock/core",
  },

  indexer: {
    api: { endpointUrl: "https://api.potlock.io" },
  },

  core: {
    campaigns: {
      contract: { accountId: "campaigns.staging.potlock.near" },
    },

    donation: {
      contract: { accountId: "donate.potlock.near" },
    },

    lists: {
      contract: { accountId: "lists.potlock.near" },
    },

    potFactory: {
      contract: { accountId: "v1.potfactory.potlock.near" },
    },

    sybil: {
      app: { url: "https://app.nada.bot" },
      contract: { accountId: "v1.nadabot.near" },
    },

    voting: {
      contract: { accountId: "v1.voting.potlock.near" },
    },
  },

  social: {
    app: { url: "https://near.social" },
    contract: { accountId: "social.near" },
  },

  deFi: {
    metapool: {
      liquidStakingContract: {
        accountId: "meta-pool.near",
      },
    },

    refFinance: {
      exchangeContract: {
        accountId: "v2.ref-finance.near",
      },
    },
  },

  features: {
    [FeatureId.DirectFtDonation]: {
      id: FeatureId.DirectFtDonation,
      name: "Direct FT donation",

      /**
       * The implementation is not finished yet
       */
      isEnabled: false,
    },

    [FeatureId.DirectNativeTokenDonation]: {
      id: FeatureId.DirectNativeTokenDonation,
      name: "Direct native token donation",
      isEnabled: true,
    },
  },
};

import { EnvConfig, FeatureId } from "@/common/types";

export const envConfig: EnvConfig = {
  platformName: "POTLOCK",
  network: "mainnet" as const,

  contractMetadata: {
    version: "0.1.0",
    repoUrl: "https://github.com/PotLock/core",
  },

  indexer: {
    api: { endpointUrl: "https://api.potlock.io" },
  },

  core: {
    donation: {
      contract: { accountId: "donate.potlock.near" },
    },

    campaigns: {
      contract: { accountId: "v1.campaigns.staging.potlock.near" },
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
      // TODO: Figure out a way to store pot-associated voting contract instances on backend / chain
      //! Be careful when refactoring this
      contract: { accountId: "mpdao.vote.potlock.near" },
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
    [FeatureId.ProfileConfiguration]: {
      id: FeatureId.ProfileConfiguration,
      name: "Profile configuration",
      isEnabled: true,
    },

    [FeatureId.FtDonation]: {
      id: FeatureId.FtDonation,
      name: "Non-pot FT donations",
      isEnabled: true,
    },

    [FeatureId.PotFtDonation]: {
      id: FeatureId.PotFtDonation,
      name: "Pot FT donations",
      isEnabled: false,
    },

    [FeatureId.DirectNativeTokenDonation]: {
      id: FeatureId.DirectNativeTokenDonation,
      name: "Direct native token donation",
      isEnabled: true,
    },

    [FeatureId.Cart]: {
      id: FeatureId.Cart,
      name: "Cart",
      isEnabled: false,
    },
  },
};

// KEYS MEANT FOR STAGING
// 1. donate.staging.potlock.near
// 2. v1.campaigns.staging.potlock.near
// 3. lists.staging.potlock.near
// 4. potfactory.staging.potlock.near
// 5. v2new.staging.nadabot.near
// 6. mpdao.vote.staging.potlock.near

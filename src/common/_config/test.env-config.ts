import { EnvConfig, FeatureId } from "@/common/types";

export const envConfig: EnvConfig = {
  platformName: "POTLOCK",
  network: "testnet" as const,

  contractMetadata: {
    version: "0.1.0",
    repoUrl: "https://github.com/PotLock/core",
  },

  indexer: {
    api: { endpointUrl: "https://test-dev.potlock.io" },
  },

  core: {
    donation: {
      contract: { accountId: "donate.potlock.testnet" },
    },

    campaigns: {
      contract: { accountId: "v1.campaign.potlock.testnet" },
    },

    lists: {
      contract: { accountId: "lists.potlock.testnet" },
    },

    potFactory: {
      contract: { accountId: "v1.potfactory.potlock.testnet" },
    },

    sybil: {
      app: { url: "https://testnet.nada.bot" },
      contract: { accountId: "v1.nadabot.testnet" },
    },

    voting: {
      contract: { accountId: "mpdaovoting.potlock.testnet" },
    },
  },

  social: {
    app: { url: "https://test.near.social" },
    contract: { accountId: "v1.social08.testnet" },
  },

  deFi: {
    metapool: {
      liquidStakingContract: {
        accountId: "meta-v2.pool.testnet",
      },
    },

    refFinance: {
      exchangeContract: {
        accountId: "ref-finance-101.testnet",
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

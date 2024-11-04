import { EnvConfig } from "@/common/types";

export const envConfig: EnvConfig = {
  network: "mainnet" as const,

  contractMetadata: {
    version: "0.1.0",
    repoUrl: "https://github.com/PotLock/core",
  },

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

  social: {
    app: { url: "https://near.social" },
    contract: { accountId: "social.near" },
  },

  indexer: {
    api: { endpointUrl: "https://api.potlock.io" },
  },
};

import { EnvConfig } from "@/common/types";

export const envConfig: EnvConfig = {
  network: "mainnet" as const,

  contractMetadata: {
    version: "0.1.0",
    repoUrl: "https://github.com/PotLock/core",
  },

  donation: {
    contract: { accountId: "donate.staging.potlock.near" },
  },

  campaigns: {
    contract: { accountId: "campaigns.staging.potlock.near" },
  },

  lists: {
    contract: { accountId: "lists.staging.potlock.near" },
  },

  potFactory: {
    contract: { accountId: "potfactory.staging.potlock.near" },
  },

  sybil: {
    app: { url: "https://staging.nada.bot" },
    contract: { accountId: "v2new.staging.nadabot.near" },
  },

  social: {
    app: { url: "https://near.social" },
    contract: { accountId: "social.near" },
  },

  indexer: {
    api: { endpointUrl: "https://dev.potlock.io" },
  },
};

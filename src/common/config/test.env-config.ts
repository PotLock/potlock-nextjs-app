import { EnvConfig } from "@/common/types";

export const envConfig: EnvConfig = {
  network: "testnet" as const,

  contractMetadata: {
    version: "0.1.0",
    repoUrl: "https://github.com/PotLock/core",
  },

  donation: {
    contract: { accountId: "donate.potlock.testnet" },
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
};

import { envConfig as productionEnvConfig } from "./production.env-config";
import { envConfig as stagingEnvConfig } from "./staging.env-config";
import { envConfig as testEnvConfig } from "./test.env-config";
import { EnvConfig, UnionFromStringList } from "../types";

export const supportedNetworks = ["mainnet" as const, "testnet" as const];

export type SupportedNetwork = UnionFromStringList<typeof supportedNetworks>;

export const envTags = ["production" as const, "staging" as const, "test" as const];

export type EnvTag = UnionFromStringList<typeof envTags>;

const isEnvTag = (input: string) => envTags.includes(input as EnvTag);

export interface ByEnvironmentTag {
  envTag: EnvTag;
}

type EnvConfigRegistry = Record<EnvTag, ByEnvironmentTag & EnvConfig>;

const envConfigRegistry: EnvConfigRegistry = {
  production: { ...productionEnvConfig, envTag: "production" },
  staging: { ...stagingEnvConfig, envTag: "staging" },
  test: { ...testEnvConfig, envTag: "test" },
};

export const getEnvConfig = (): ByEnvironmentTag & EnvConfig => {
  const deploymentEnvTag = process.env.NEXT_PUBLIC_ENV?.toLowerCase();

  const envTag = isEnvTag((deploymentEnvTag ?? "test") as EnvTag)
    ? (deploymentEnvTag as EnvTag)
    : "test";

  return envConfigRegistry[envTag];
};

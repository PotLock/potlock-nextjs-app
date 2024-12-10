import { NETWORK } from "@/common/_config";

export const isEthereumAddress = (input: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(input);
};

export const isImplicitNearAccountId = (input: string): boolean => /^[a-fA-F0-9]{64}$/.test(input);

export const isAccountId = (input?: string | null): boolean =>
  typeof input === "string"
    ? isEthereumAddress(input) ||
      isImplicitNearAccountId(input) ||
      input.endsWith(`.${NETWORK === "mainnet" ? "near" : "testnet"}`)
    : false;

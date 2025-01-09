import { NETWORK } from "@/common/_config";

export const isEthereumAddress = (input: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(input);
};

export const isImplicitNearAccountId = (input: string): boolean => /^[a-fA-F0-9]{64}$/.test(input);

export const isTelegramAccountId = (input: string): boolean => input.endsWith(".tg");

export const isAccountId = (input?: string | null): boolean =>
  typeof input === "string"
    ? isEthereumAddress(input) ||
      isImplicitNearAccountId(input) ||
      isTelegramAccountId(input) ||
      input.endsWith(`.${NETWORK === "mainnet" ? "near" : "testnet"}`)
    : false;

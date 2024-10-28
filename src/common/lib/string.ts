import { NETWORK } from "@/common/config";

export const truncate = (input: string, maxLength: number) => {
  if (!input) return "";

  if (input.length <= maxLength) {
    return input;
  }
  return input.substring(0, maxLength - 3) + "...";
};

export const isAccountId = (input: string): boolean =>
  input.endsWith(`.${NETWORK === "mainnet" ? "near" : "testnet"}`);

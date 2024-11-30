import { NETWORK } from "@/common/_config";

export const truncate = (input: string, maxLength: number) => {
  if (!input) return "";

  if (input.length <= maxLength) {
    return input;
  }
  return input.substring(0, maxLength - 3) + "...";
};

export const isEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const isNetworkAccountId = (input: string): boolean =>
  isEthereumAddress(input) || input.endsWith(`.${NETWORK === "mainnet" ? "near" : "testnet"}`);

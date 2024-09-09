import { Social } from "@builddao/near-social-js";
import axios from "axios";

import { ClientConfig } from "@/common/types";

export const client = axios.create({
  baseURL: "https://api.near.social",
});

export const CLIENT_CONFIG: ClientConfig = {
  swr: {},
};

export const nearSocialClient = new Social({
  contractId: process.env.NEXT_PUBLIC_SOCIAL_DB_CONTRACT_ID,
  network: process.env.NEXT_PUBLIC_NETWORK,
});

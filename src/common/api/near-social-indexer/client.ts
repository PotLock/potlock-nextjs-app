import { Social } from "@builddao/near-social-js";
import axios from "axios";

import { NETWORK, SOCIAL_DB_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { ClientConfig } from "@/common/types";

export const nearSocialIndexerClient = axios.create({
  baseURL: "https://api.near.social",
});

export const CLIENT_CONFIG: ClientConfig = {
  swr: {},
};

export const nearSocialClient = new Social({
  contractId: SOCIAL_DB_CONTRACT_ACCOUNT_ID,
  network: NETWORK,
});

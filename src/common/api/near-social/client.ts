import { Social } from "@builddao/near-social-js";
import axios from "axios";

import { NETWORK, SOCIAL_DB_CONTRACT_ID } from "@/common/constants";
import { ClientConfig } from "@/common/types";

export const client = axios.create({
  baseURL: "https://api.near.social",
});

export const CLIENT_CONFIG: ClientConfig = {
  swr: {},
};

export const nearSocialClient = new Social({
  contractId: SOCIAL_DB_CONTRACT_ID,
  network: NETWORK,
});

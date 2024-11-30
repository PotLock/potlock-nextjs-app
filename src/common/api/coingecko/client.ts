import axios from "axios";

import { ClientConfig } from "@/common/types";

export const client = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
});

export const CLIENT_CONFIG: ClientConfig = {
  swr: {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnMount: false,
    refreshInterval: 1800000,
  },
};

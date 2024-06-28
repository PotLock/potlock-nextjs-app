import axios from "axios";

export const client = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
});

export const CLIENT_CONFIG = {
  swr: {
    refreshInterval: 60000,
    focusThrottleInterval: 30000,
  },
};

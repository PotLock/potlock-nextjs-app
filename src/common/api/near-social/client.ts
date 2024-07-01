import axios from "axios";

import { ClientConfig } from "@/common/types";

export const client = axios.create({
  baseURL: "https://api.near.social",
});

export const CLIENT_CONFIG: ClientConfig = {
  swr: {},
};

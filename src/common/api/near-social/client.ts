import axios from "axios";

export const client = axios.create({
  baseURL: "https://api.near.social",
});

export const CLIENT_CONFIG = {
  swr: {},
};

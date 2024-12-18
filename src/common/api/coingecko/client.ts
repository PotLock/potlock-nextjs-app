import axios from "axios";

export const client = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
});

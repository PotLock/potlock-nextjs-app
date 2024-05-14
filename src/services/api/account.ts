import { URI } from "./API";

export const getAccounts = async () => {
  const res = await fetch(`${URI}/accounts`);
  const json = await res.json();
  return json;
};

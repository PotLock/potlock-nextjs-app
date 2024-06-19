import { Pot } from "./generated";
import { POTLOCK_API_ENDPOINT } from "../../constants";

export const getPot = async ({ potId }: { potId: string }) => {
  const res = await fetch(`${POTLOCK_API_ENDPOINT}/api/v1/pots/${potId}/`);
  const json = await res.json();
  return json as Pot;
};

export const getPots = async () => {
  const res = await fetch(`${POTLOCK_API_ENDPOINT}/api/v1/pots/`);
  const json = await res.json();
  return json as Pot[];
};

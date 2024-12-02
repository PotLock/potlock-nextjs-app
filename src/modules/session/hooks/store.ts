import { prop } from "remeda";

import { useGlobalStoreSelector } from "@/store";

export const useAuth = () => {
  const auth = useGlobalStoreSelector(prop("session"));
  return auth;
};

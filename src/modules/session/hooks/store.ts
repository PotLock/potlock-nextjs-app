import { useGlobalStoreSelector } from "@/store";

export const useAuth = () => {
  const auth = useGlobalStoreSelector((state) => state.auth);
  return auth;
};

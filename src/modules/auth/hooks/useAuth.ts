import { useTypedSelector } from "@/modules/core/store";

export const useAuth = () => {
  const auth = useTypedSelector((state) => state.auth);
  return auth;
};

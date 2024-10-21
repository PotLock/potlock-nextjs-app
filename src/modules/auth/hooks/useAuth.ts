import { useTypedSelector } from "@/store";

export const useAuth = () => {
  const auth = useTypedSelector((state) => state.auth);
  return auth;
};

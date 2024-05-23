import { useTypedSelector } from "@app/store";

export const useAuth = () => {
  const auth = useTypedSelector((state) => state.auth);
  return auth;
};
